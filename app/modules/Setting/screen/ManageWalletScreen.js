import React, { Component } from 'react'
import {
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  SafeAreaView,
  View,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native'
import PropsType from 'prop-types'
import { observer } from 'mobx-react/native'
import { NavigationActions } from 'react-navigation'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'
import LayoutUtils from '../../../commons/LayoutUtils'
import ManageWalletItem from '../elements/ManageWalletItem'
import MainStore from '../../../AppStores/MainStore'
import ActionSheetCustom from '../../../components/elements/ActionSheetCustom'
import NavStore from '../../../AppStores/NavStore'
import ManageWalletStore from '../stores/ManageWalletStore'

const marginTop = LayoutUtils.getExtraTop()
const { width, height } = Dimensions.get('window')

@observer
export default class ListWalletScreen extends Component {
  static propTypes = {
    navigation: PropsType.object
  }

  static defaultProps = {
    navigation: null
  }

  constructor(props) {
    super(props)
    this.manageWalletStore = new ManageWalletStore()
    this.state = {
      isShowExportPrivateKeyBtn: true,
      isShowImplementPrivateKey: false
    }
  }

  onActionPress = (index) => {
    this.selectedWallet = this.wallets[index]
    this.setState({
      isShowExportPrivateKeyBtn: this.shouldShowExportPrivateKey,
      isShowImplementPrivateKey: this.selectedWallet.importType === 'Address'
    }, () => {
      this.actionSheet.show()
    })
  }

  onCancelAction = () => {
    this.actionSheet.hide()
  }

  getPrivateKey(ds) {
    this.selectedWallet.setSecureDS(ds)
    return this.selectedWallet.derivePrivateKey()
  }

  get shouldShowExportPrivateKey() {
    if (!this.selectedWallet.importType) {
      return MainStore.appState.didBackup
    }
    return this.selectedWallet.importType !== 'Address'
  }

  get wallets() {
    return MainStore.appState.wallets
  }

  _renderItem = ({ item, index }) =>
    (
      <ManageWalletItem
        index={index}
        action={() => {
          this.selectedIndex = index
          this.onActionPress(index)
        }}
        onPress={() => {
          // manageWalletStore.selectedWallet = this.wallets[index]
          NavStore.pushToScreen('ManageWalletDetailScreen', {
            wallet: this.wallets[index]
          })
        }}
      />
    )

  returnData = (isCreateSuccess, index, isCreate) => {
    const { navigation } = this.props
    if (isCreateSuccess) {
      navigation.state.params.returnData(isCreateSuccess, index, isCreate)
    }
  }

  _renderNoWalletView() {
    return (
      <View style={{ alignItems: 'center', flex: 1, marginBottom: height * 0.03 }}>
        <Image
          source={images.noWalletImage}
          style={styles.contactImageStyle}
        />
        <Text style={{
          fontSize: 26,
          fontFamily: AppStyle.mainFontBold,
          marginTop: height * 0.07,
          color: AppStyle.titleDarkModeColor
        }}
        >No wallets yet
        </Text>
        <Text style={{
          fontSize: 18,
          fontFamily: AppStyle.mainFontSemiBold,
          marginTop: height * 0.02,
          color: '#8A8D97'
        }}
        >
          Get started by adding your first one.
        </Text>
      </View>
    )
  }

  _renderAddressList() {
    const { wallets } = this
    return (
      <FlatList
        style={{ flex: 1, marginTop: 15 }}
        data={wallets}
        ListEmptyComponent={this._renderNoWalletView()}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => item.address}
        renderItem={this._renderItem}
        ListFooterComponent={this._renderFooter}
      />
    )
  }

  _renderContentView() {
    return this._renderAddressList()
  }

  _renderFooter = () => {
    const { navigation } = this.props
    const { wallets } = this
    let backgroundColor
    if (wallets.length === 10) {
      return null
    }
    if (wallets.length === 0) {
      backgroundColor = { backgroundColor: AppStyle.backgroundColor }
    }
    return (
      <TouchableOpacity
        style={[
          styles.addContactButtonStyle,
          backgroundColor
        ]}
        onPress={() => {
          navigation.navigate('CreateWalletStack', {
            returnData: this.returnData,
            index: wallets.length
          })
        }}
      >
        <Image
          source={images.icon_addBold}
          style={{
            tintColor: AppStyle.mainColor,
            marginRight: 10,
            width: 23,
            height: 23,
            resizeMode: 'contain'
          }}
        />
        <Text
          style={styles.textOfButtonStyle}
        >Add New Wallet
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    const { navigation } = this.props
    const { isShowExportPrivateKeyBtn, isShowImplementPrivateKey } = this.state
    return (
      <TouchableWithoutFeedback onPress={() => { this.actionSheet.hide() }}>
        <SafeAreaView style={styles.container}>
          <NavigationHeader
            style={{ marginTop: 20 + marginTop }}
            headerItem={{
              title: 'Manage Wallets',
              icon: null,
              button: images.backButton
            }}
            action={() => {
              navigation.dispatch(NavigationActions.back())
            }}
          />
          {this._renderContentView()}
          <ActionSheetCustom ref={(ref) => { this.actionSheet = ref }} onCancel={this.onCancelAction}>
            <TouchableOpacity onPress={this.onEdit}>
              <View style={[styles.actionButton, { borderBottomWidth: 1, borderColor: AppStyle.borderLinesSetting }]}>
                <Text style={[styles.actionText, { color: '#4A90E2' }]}>Edit Wallet Name</Text>
              </View>
            </TouchableOpacity>
            {isShowExportPrivateKeyBtn &&
              <TouchableOpacity onPress={this.onExportPrivateKey}>
                <View style={[styles.actionButton, { borderBottomWidth: 1, borderColor: AppStyle.borderLinesSetting }]}>
                  <Text style={[styles.actionText, { color: '#4A90E2' }]}>Export Private Key</Text>
                </View>
              </TouchableOpacity>
            }
            {isShowImplementPrivateKey &&
              <TouchableOpacity onPress={this.onAddPrivateKey}>
                <View style={[styles.actionButton, { borderBottomWidth: 1, borderColor: AppStyle.borderLinesSetting }]}>
                  <Text style={[styles.actionText, { color: '#4A90E2' }]}>Add Private Key</Text>
                </View>
              </TouchableOpacity>
            }
            <TouchableOpacity onPress={this.onDelete}>
              <View style={styles.actionButton}>
                <Text style={[styles.actionText, { color: AppStyle.errorColor }]}>Remove Wallet</Text>
              </View>
            </TouchableOpacity>
          </ActionSheetCustom>
        </SafeAreaView >
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppStyle.backgroundDarkMode
  },
  addContactButtonStyle: {
    flexDirection: 'row',
    height: 71,
    backgroundColor: AppStyle.backgroundContentDarkMode,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textOfButtonStyle: {
    color: '#E4BF43',
    fontFamily: AppStyle.mainFontSemiBold,
    fontSize: 18
  },
  actionButton: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    width: width - 40,
    backgroundColor: AppStyle.backgroundDarkBlue
  },
  actionText: {
    fontSize: 16,
    fontFamily: 'OpenSans-Semibold'
  },
  contactImageStyle: {
    resizeMode: 'contain',
    width: 168,
    marginTop: height * 0.05
  }
})
