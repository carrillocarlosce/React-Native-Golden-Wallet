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
  TouchableWithoutFeedback,
  Animated,
  Easing
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
import NotificationStore from '../../../AppStores/stores/Notification'

const marginTop = LayoutUtils.getExtraTop()
const { width } = Dimensions.get('window')

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
  }

  onActionPress = (index) => {
    this.selectedWallet = this.wallets[index]
    this.actionSheet.show()
  }

  onCancelAction = () => {
    this.actionSheet.hide()
  }

  onEdit = () => {
    this.actionSheet.hide(() => {
      NavStore.popupCustom.show(
        'Wallet Name',
        [
          {
            text: 'Cancel',
            onClick: () => {
              NavStore.popupCustom.hide()
            }
          },
          {
            text: 'OK',
            onClick: async (text) => {
              this.selectedWallet.title = text
              await this.manageWalletStore.editWallet(this.selectedWallet)
              NotificationStore.addWallets()
              NavStore.popupCustom.hide()
            }
          }
        ],
        'Enter your wallet name',
        'input',
        false,
        this.selectedWallet.title,
        true
      )
    })
  }

  onDelete = () => {
    this.actionSheet.hide(() => {
      NavStore.lockScreen({
        onUnlock: (pincode) => {
          NavStore.popupCustom.show(
            'Remove Wallet',
            [
              {
                text: 'Cancel',
                onClick: () => {
                  NavStore.popupCustom.hide()
                }
              },
              {
                text: 'Remove',
                onClick: async (text) => {
                  const { wallets, selectedWallet } = MainStore.appState
                  const index = wallets.indexOf(selectedWallet)
                  if (index === wallets.length - 1) {
                    MainStore.appState.setSelectedWallet(null)
                  }
                  await this.manageWalletStore.removeWallet(this.selectedWallet)
                  NavStore.popupCustom.hide()
                }
              }
            ],
            'Enter your wallet name to remove',
            'input',
            false,
            this.selectedWallet.title,
            true,
            null,
            true
          )
          // NavStore.popupCustom.show(
          //   'Are you sure you want to remove this wallet ?',
          //   [
          //     {
          //       text: 'Cancel',
          //       onClick: () => {
          //         NavStore.popupCustom.hide()
          //       }
          //     },
          //     {
          //       text: 'Remove',
          //       onClick: async () => {
          //         const { wallets, selectedWallet } = MainStore.appState
          //         const index = wallets.indexOf(selectedWallet)
          //         if (index === wallets.length - 1) {
          //           MainStore.appState.setSelectedWallet(null)
          //         }
          //         await this.manageWalletStore.removeWallet(this.selectedWallet)
          //         NavStore.popupCustom.hide()
          //       }
          //     }
          //   ]
          // )
        }
      }, true)
    })
  }

  get wallets() {
    return MainStore.appState.wallets
  }

  _renderItem = ({ item, index }) =>
    (
      <ManageWalletItem index={index} action={() => { this.onActionPress(index) }} />
    )

  returnData = (isCreateSuccess, index, isCreate) => {
    const { navigation } = this.props
    if (isCreateSuccess) {
      navigation.state.params.returnData(isCreateSuccess, index, isCreate)
    }
  }

  _renderNoWalletView() {
    return (
      <View style={{ alignItems: 'center', flex: 1, marginBottom: 30 }}>
        <Image
          source={images.noWalletImage}
          style={styles.contactImageStyle}
        />
        <Text style={{
          fontSize: 26,
          fontFamily: AppStyle.mainFontBold,
          marginTop: 60,
          color: AppStyle.titleDarkModeColor
        }}
        >No wallets yet
        </Text>
        <Text style={{
          fontSize: 18,
          fontFamily: AppStyle.mainFontSemiBold,
          marginTop: 20,
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
  }
})
