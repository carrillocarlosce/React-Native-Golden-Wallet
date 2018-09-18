import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Platform,
  Dimensions,
  Animated,
  Clipboard,
  Text,
  TouchableOpacity
} from 'react-native'
import FCM from 'react-native-fcm'
import Share from 'react-native-share'
import RNFS from 'react-native-fs'
import Carousel from 'react-native-snap-carousel'
import { observer } from 'mobx-react/native'
import DeviceInfo from 'react-native-device-info'
import SplashScreen from 'react-native-splash-screen'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import LargeCard from '../elements/LargeCard'
import Hamburger from '../elements/HamburgerButton'
import SettingScreen from '../../Setting/screen/SettingScreen'
import HomeSendButton from '../elements/HomeSendButton'
import LayoutUtils from '../../../commons/LayoutUtils'
import AppStyle from '../../../commons/AppStyle'
import constant from '../../../commons/constant'
import MainStore from '../../../AppStores/MainStore'
import NavStore from '../../../AppStores/NavStore'
import Config from '../../../AppStores/stores/Config'
import Router from '../../../AppStores/Router'
import TickerStore from '../stores/TickerStore'
import NotificationStore from '../../../AppStores/stores/Notification'
import AppVersion from '../../../AppStores/stores/AppVersion'
import ActionSheetCustom from '../../../components/elements/ActionSheetCustom'

const marginTop = LayoutUtils.getExtraTop()
const { width, height } = Dimensions.get('window')
const heightCarousel = height - 200 - marginTop + 60
const contentAlertBackup = 'The Recovery Phrase protects your wallet and can be used to restore your assets if your device will be lost or damaged. Don’t skip the backup step!'

@observer
export default class HomeScreen extends Component {
  constructor(props) {
    super(props)
    FCM.setBadgeNumber(0)
    this.lastIndex = 0
    this.translateY = new Animated.Value(0)
  }

  componentDidMount() {
    AppVersion.getChangelogsLatest()
    AppVersion.getChangelogsList()
    setTimeout(() => {
      SplashScreen.hide()
      NavStore.pushToScreen('UnlockScreen', {
        isLaunchApp: true,
        onUnlock: this.onUnlock
      })
    }, 0)
  }

  onUnlock = () => {
    TickerStore.callApi()
    MainStore.appState.startAllBgJobs()
    if (!NotificationStore.isInitFromNotification) {
      if (this.shouldShowUpdatePopup) {
        this._gotoNewUpdatedAvailableScreen()
      } else if (MainStore.appState.wallets.length === 0) {
        this._gotoCreateWallet()
      }
    } else {
      NotificationStore.isInitFromNotification = false
      NotificationStore.gotoTransaction()
    }
  }

  onSendPress = () => {
    const { selectedWallet } = MainStore.appState
    if (!selectedWallet) {
      return
    }
    Router.SendTransaction.goToSendTx()
    MainStore.appState.setselectedToken(selectedWallet.tokens[0])
    MainStore.sendTransaction.changeIsToken(false)
  }

  onBackup = () => {
    NavStore.lockScreen({
      onUnlock: async (pincode) => {
        await Router.Backup.gotoBackup(pincode)
      }
    }, true)
  }

  onAlertBackup = () => {
    NavStore.popupCustom.show(
      'No backup, No wallet!',
      [
        {
          text: 'Later',
          onClick: () => {
            NavStore.popupCustom.hide()
          }
        },
        {
          text: 'Backup now',
          onClick: () => {
            NavStore.popupCustom.hide()
            this.onBackup()
          }
        }
      ],
      contentAlertBackup
    )
  }

  onSnapToItem = (index) => {
    const { wallets } = MainStore.appState
    MainStore.appState.setCurrentCardIndex(index)
    if (this.cards[index].address === '0') {
      // MainStore.appState.setSelectedWallet({})
    } else {
      MainStore.appState.setSelectedWallet(wallets[index])
    }
    if (this.lastIndex < wallets.length) {
      wallets[this.lastIndex].walletCard && wallets[this.lastIndex].walletCard.reflipCard()
    }
    this.lastIndex = index
  }

  onCopy = () => {
    Clipboard.setString(MainStore.appState.selectedWallet.address)
    NavStore.showToastTop('Address Copied!', {}, { color: AppStyle.mainColor })
  }

  onHamburgerPress = (isShow) => {
    Animated.timing(
      this.translateY,
      {
        toValue: isShow ? 1 : 0,
        duration: 250
      }
    ).start()
  }

  get lastestVersion() {
    return AppVersion.latestVersion.version_number
  }

  get shouldShowUpdatePopup() {
    if (__DEV__) return false
    const { lastestVersionRead, shouldShowUpdatePopup } = MainStore.appState
    const version = DeviceInfo.getVersion()
    if (version < this.lastestVersion) {
      return lastestVersionRead < this.lastestVersion || shouldShowUpdatePopup
    }
    return false
  }

  openShare = (filePath) => {
    NavStore.preventOpenUnlockScreen = true
    RNFS.readFile(filePath, 'base64').then((file) => {
      const shareOptions = {
        title: 'Golden',
        message: `My address: ${MainStore.appState.selectedWallet.address}`,
        url: `data:image/png;base64,${file}`
      }
      Share.open(shareOptions).catch(() => { })
    })
  }

  _renderNetwork = () => {
    let currentNetwork = MainStore.appState.config.network
    const color = { backgroundColor: AppStyle.mainColor }
    if (currentNetwork === Config.networks.mainnet) {
      return <View />
    }
    currentNetwork = currentNetwork.replace(/^\w/, c => c.toUpperCase())
    return (
      <View style={styles.networkField}>
        <View style={[styles.dot, color]} />
        <Text style={styles.networkText}>{`Active Network: ${currentNetwork}`}</Text>
      </View>
    )
  }

  _renderSendButton = () =>
    (
      <HomeSendButton
        action={this.onSendPress}
      />
    )

  _gotoCreateWallet() {
    NavStore.pushToScreen('CreateWalletStack')
  }

  _gotoNewUpdatedAvailableScreen() {
    NavStore.pushToScreen('NewUpdatedAvailableScreen')
  }

  _onLongPress = () => {
    this.actionSheet.show()
  }

  _renderActionSheet = selectedWallet => (
    <ActionSheetCustom ref={(ref) => { this.actionSheet = ref }} onCancel={this._onCancelAction}>
      <TouchableOpacity onPress={() => { }}>
        <View style={[styles.actionButton, { borderBottomWidth: 1, borderColor: AppStyle.borderLinesSetting }]}>
          <Text style={[styles.actionText, { color: '#4A90E2' }]}>Edit Wallet Name</Text>
        </View>
      </TouchableOpacity>
      {selectedWallet && selectedWallet.didBackup && selectedWallet.importType && selectedWallet.importType !== 'Address' &&
        <TouchableOpacity onPress={() => { }}>
          <View style={[styles.actionButton, { borderBottomWidth: 1, borderColor: AppStyle.borderLinesSetting }]}>
            <Text style={[styles.actionText, { color: '#4A90E2' }]}>Export Private Key</Text>
          </View>
        </TouchableOpacity>}
      {selectedWallet && selectedWallet.importType && selectedWallet.importType === 'Address' &&
        <TouchableOpacity onPress={() => { }}>
          <View style={[styles.actionButton, { borderBottomWidth: 1, borderColor: AppStyle.borderLinesSetting }]}>
            <Text style={[styles.actionText, { color: '#4A90E2' }]}>Add Private Key</Text>
          </View>
        </TouchableOpacity>}
      <TouchableOpacity onPress={() => { }}>
        <View style={styles.actionButton}>
          <Text style={[styles.actionText, { color: AppStyle.errorColor }]}>Remove Wallet</Text>
        </View>
      </TouchableOpacity>
    </ActionSheetCustom>
  )

  _onCancelAction = () => {
    this.actionSheet.hide()
  }

  _renderCard = ({ item, index }) =>
    (
      <LargeCard
        ref={(ref) => {
          const { wallets } = MainStore.appState
          if (index < wallets.length) {
            wallets[index].setWalletCard(ref)
          }
        }}
        index={index}
        style={{ margin: 5, marginTop: 20 }}
        onPress={() => {
          index !== this.wallets.length
            ? NavStore.pushToScreen('TokenScreen', { index })
            : this._gotoCreateWallet()
        }}
        onLongPress={this._onLongPress}
        onAddPrivateKey={() => {
          NavStore.pushToScreen('ImplementPrivateKeyScreen', { index })
        }}
        onBackup={this.onBackup}
        onAlertBackup={this.onAlertBackup}
        onCopy={this.onCopy}
        onShare={this.openShare}
      />
    )

  _goToDapp = () => {
    if (!MainStore.appState.selectedWallet) {
      NavStore.popupCustom.show('You have no wallet')
      return
    }
    if (!MainStore.appState.selectedWallet.canSendTransaction) {
      NavStore.popupCustom.show('Your wallet is read only')
      return
    }
    Router.DAppBrowser.goToDApp()
    NavStore.pushToScreen('DAppListScreen')
  }

  checkPrivateKey(privateKey) {
    return privateKey !== undefined && privateKey !== ''
  }

  render() {
    const { translateY } = this
    const changeOpacityListCoin = translateY.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    })
    const changeOpacitySetting = translateY.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp'
    })
    this.wallets = MainStore.appState.wallets.slice()
    this.cards = this.wallets
    const { selectedWallet } = MainStore.appState
    if (this.cards.length < 10) {
      this.cards = [...this.cards, {
        balance: '0 ETH',
        balanceUSD: '$0',
        address: '0'
      }]
    }

    return (
      <View style={styles.container}>
        <View style={styles.homeHeader}>
          <Hamburger
            style={{ flex: 0 }}
            onPressHamburger={this.onHamburgerPress}
          />
          <View
            style={{
              flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
            }}
          >
            <Animated.Text
              style={[styles.settingText, { opacity: changeOpacitySetting }]}
            >
              {constant.SETTING}
            </Animated.Text>
            <Animated.View
              style={[styles.animHomeHeader, { opacity: changeOpacityListCoin }]}
            >
              <TouchableOpacity
                style={styles.browserButton}
                onPress={this._goToDapp}
              >
                <Text style={{ color: AppStyle.mainColor, fontFamily: 'OpenSans-Semibold' }}>DApps Browser</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
        <View style={{ height: heightCarousel }}>
          <Carousel
            removeClippedSubviews={false}
            ref={(c) => { this._carousel = c }}
            data={this.cards}
            layout="default"
            renderItem={this._renderCard}
            sliderWidth={width}
            itemWidth={width - 72}
            inactiveSlideOpacity={1}
            keyExtractor={item => item.address}
            onSnapToItem={this.onSnapToItem}
          />
        </View>
        <View
          style={styles.bottomField}
        >
          {this._renderNetwork()}
          {this._renderSendButton()}
        </View>
        <Animated.View
          style={[styles.containerSetting, {
            transform: [
              {
                translateY: translateY.interpolate({
                  inputRange: [0, 1],
                  outputRange: [height - 41 + marginTop, Platform.OS === 'ios' ? 0 : getStatusBarHeight()],
                  extrapolate: 'clamp',
                  useNativeDriver: true
                })
              }
            ]
          }]}
        >
          <SettingScreen
            onCreated={(index) => {
              this._carousel.snapToItem(index)
            }}
          />
        </Animated.View>
        {this._renderActionSheet(selectedWallet)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  homeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: marginTop + 20,
    paddingLeft: 10,
    paddingBottom: 15
  },
  networkField: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20
  },
  bottomField: {
    marginTop: -25,
    flex: 1,
    marginLeft: 36,
    marginRight: 20,
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5
  },
  networkText: {
    fontSize: 12,
    fontFamily: 'OpenSans-Semibold',
    marginLeft: 4,
    color: AppStyle.mainTextColor
  },
  settingText: {
    fontSize: 20,
    color: AppStyle.mainTextColor,
    fontFamily: 'OpenSans-Bold'
  },
  animHomeHeader: {
    overflow: 'hidden',
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  browserButton: {
    height: 40,
    backgroundColor: '#121734',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 20
  },
  containerSetting: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 81 + marginTop : 71,
    width,
    height: height - 71 + marginTop
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
