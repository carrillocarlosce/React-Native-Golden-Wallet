import React, { Component } from 'react'
import {
  FlatList,
  Text,
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity
} from 'react-native'
import { observer } from 'mobx-react/native'
import PropsType from 'prop-types'
import { NavigationActions } from 'react-navigation'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'
import LayoutUtils from '../../../commons/LayoutUtils'
import SettingItem from '../elements/SettingItem'
import MainStore from '../../../AppStores/MainStore'
import NavStore from '../../../AppStores/NavStore'
import AddressElement from '../../../components/elements/AddressElement'
import Helper from '../../../commons/Helper'
import ManageWalletStore from '../stores/ManageWalletStore'

const marginTop = LayoutUtils.getExtraTop()

@observer
export default class ManageWalletDetailScreen extends Component {
  static propTypes = {
    navigation: PropsType.object
  }

  static defaultProps = {
    navigation: null
  }

  constructor(props) {
    super(props)
    this.manageWalletStore = new ManageWalletStore()
    this.wallet = this.props.navigation ? this.props.navigation.state.params.wallet : {}
  }

  onNotificationSwitch(isEnable, wallet) {
    this.manageWalletStore.switchEnableNotification(isEnable, wallet)
  }

  get currentStateEnableNotification() {
    return this.wallet.enableNotification
  }

  get shouldShowExportPrivateKey() {
    if (!this.wallet.importType) {
      return MainStore.appState.didBackup
    }
    return this.wallet.importType !== 'Address'
  }

  get symbol() {
    const { type } = this.wallet
    if (type === 'ethereum') {
      return 'ETH'
    }
    return 'BTC'
  }

  handleRemovePressed = (pincode) => {
    NavStore.pushToScreen('RemoveWalletScreen', {
      wallet: this.wallet
    })
  }

  handleAddPrivKeyPressed = () => {
    NavStore.pushToScreen('AddPrivateKeyScreen', {
      wallet: this.wallet
    })
  }

  goBack = () => {
    this.props.navigation.dispatch(NavigationActions.back())
  }

  _renderRemoveWallet = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          NavStore.lockScreen({
            onUnlock: this.handleRemovePressed
          }, true)
        }}
      >
        <View style={styles.removeField}>
          <Text style={styles.text}>Remove Wallet</Text>
        </View>
      </TouchableOpacity>
    )
  }

  _renderValueAndAddress = () => {
    return (
      <View style={{
        marginTop: 15,
        marginHorizontal: 20
      }}
      >
        <Text style={styles.ethValue}>{`${Helper.formatETH(this.wallet.totalBalance)} ${this.symbol}`}</Text>
        <AddressElement
          style={{ marginTop: 15, width: 328 }}
          textStyle={{ fontSize: 16 }}
          address={this.wallet.address}
        />
      </View>
    )
  }

  _renderOptions = () => {
    const enableNotif = this.currentStateEnableNotification
    return (
      <View>
        <FlatList
          style={{ marginTop: 30 }}
          data={this.manageWalletStore.options}
          keyExtractor={v => v.mainText}
          scrollEnabled={false}
          renderItem={({ item, index }) => {
            if (index == this.manageWalletStore.options.length - 1) {
              return (
                <SettingItem
                  mainText={item.mainText}
                  disable
                  type="switch"
                  enableSwitch={enableNotif}
                  onSwitch={() => this.onNotificationSwitch(!enableNotif, this.wallet)}
                />
              )
            }
            if (index == 1 && !this.shouldShowExportPrivateKey) {
              return (
                <SettingItem
                  style={{ borderTopWidth: index === 0 ? 0 : 1 }}
                  mainText="Add Private Key"
                  onPress={this.handleAddPrivKeyPressed}
                  iconRight={item.iconRight}
                />
              )
            }
            return (
              <SettingItem
                style={{ borderTopWidth: index === 0 ? 0 : 1 }}
                mainText={item.mainText}
                onPress={() => {
                  this.manageWalletStore.selectedWallet = this.wallet
                  item.onPress()
                }}
                iconRight={item.iconRight}
              />
            )
          }}
        />
      </View>
    )
  }

  render() {
    return (
      <SafeAreaView style={styles.container} >
        <NavigationHeader
          style={{ marginTop: 20 + marginTop }}
          headerItem={{
            title: this.wallet.title,
            icon: null,
            button: images.backButton
          }}
          action={this.goBack}
        />
        {this._renderValueAndAddress()}
        {this._renderOptions()}
        {this._renderRemoveWallet()}
      </SafeAreaView >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppStyle.backgroundDarkMode
  },
  ethValue: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 30,
    color: AppStyle.mainColor
  },
  removeField: {
    backgroundColor: AppStyle.backgroundTextInput,
    padding: 20,
    marginTop: 30
  },
  text: {
    color: AppStyle.errorColor,
    fontSize: 14,
    fontFamily: 'OpenSans-Semibold'
  }
})
