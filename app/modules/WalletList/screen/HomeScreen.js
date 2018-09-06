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
import PropTypes from 'prop-types'
import FCM from 'react-native-fcm'
import Share from 'react-native-share'
import RNFS from 'react-native-fs'
import Carousel, { getInputRangeFromIndexes } from 'react-native-snap-carousel'
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
import Ticker from '../elements/Ticker'
import TickerStore from '../stores/TickerStore'
import NotificationStore from '../../../AppStores/stores/Notification'
import AppVersion from '../../../AppStores/stores/AppVersion'

const marginTop = LayoutUtils.getExtraTop()
const { width, height } = Dimensions.get('window')
const heightCarousel = height - 200 - marginTop + 60

@observer
export default class HomeScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }

  constructor(props) {
    super(props)
    FCM.setBadgeNumber(0)
    this.lastIndex = 0
    this.state = {
      translateY: new Animated.Value(0)
    }
  }

  componentDidMount() {
    AppVersion.getChangelogsLatest()
    AppVersion.getChangelogsList()
    setTimeout(() => {
      SplashScreen.hide()
      this.props.navigation.navigate('UnlockScreen', {
        isLaunchApp: true,
        onUnlock: () => {
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
      })
    }, 100)
  }

  onSendPress = () => {
    const { navigation } = this.props
    const { selectedWallet } = MainStore.appState
    if (!selectedWallet) {
      return
    }
    MainStore.goToSendTx()
    MainStore.appState.setselectedToken(selectedWallet.tokens[0])
    MainStore.sendTransaction.changeIsToken(false)
    navigation.navigate('SendTransactionStack')
    // navigation.navigate('DAppStack')
  }

  onBackup = () => {
    NavStore.lockScreen({
      onUnlock: async (pincode) => {
        await MainStore.gotoBackup(pincode)
        this.props.navigation.navigate('BackupStack')
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
      'The Recovery Phrase protects your wallet and can be used to restore your assets if your device will be lost or damaged. Don’t skip the backup step!'
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
    this.props.navigation.navigate('CreateWalletStack')
  }

  _gotoNewUpdatedAvailableScreen() {
    this.props.navigation.navigate('NewUpdatedAvailableScreen')
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
        navigation={this.props.navigation}
        onPress={() => {
          index !== this.wallets.length
            ? this.props.navigation.navigate('TokenScreen', { index })
            : this._gotoCreateWallet()
        }}
        onAddPrivateKey={() => {
          this.props.navigation.navigate('ImplementPrivateKeyScreen', { index })
        }}
        onBackup={this.onBackup}
        onAlertBackup={this.onAlertBackup}
        onCopy={() => {
          Clipboard.setString(MainStore.appState.selectedWallet.address)
          NavStore.showToastTop('Address Copied!', {}, { color: AppStyle.mainColor })
        }}
        onShare={this.openShare}
      />
    )

  stackScrollInterpolator = (index, carouselProps) => {
    const range = [1, 0, -1, -2, -3]
    const inputRange = getInputRangeFromIndexes(range, index, carouselProps)
    const outputRange = range
    return { inputRange, outputRange }
  }

  stackAnimatedStyles = (index, animatedValue, carouselProps) => {
    const sizeRef = carouselProps.vertical ? carouselProps.itemHeight : carouselProps.itemWidth
    const translateProp = carouselProps.vertical ? 'translateY' : 'translateX'

    const cardOffset = 18
    const card1Scale = 0.9
    const card2Scale = 0.8

    const getTranslateFromScale = (index2, scale) => {
      const centerFactor = 1 / scale * index2
      const centeredPosition = -Math.round(sizeRef * centerFactor)
      const edgeAlignment = Math.round((sizeRef - (sizeRef * scale)) / 2)
      const offset = Math.round(cardOffset * Math.abs(index2) / scale)

      return centeredPosition - edgeAlignment - offset
    }

    return {
      opacity: animatedValue.interpolate({
        inputRange: [-3, -2, -1, 0],
        outputRange: [0, 0.5, 0.75, 1],
        extrapolate: 'clamp'
      }),
      transform: [{
        scale: animatedValue.interpolate({
          inputRange: [-2, -1, 0, 1],
          outputRange: [card2Scale, card1Scale, 1, card1Scale],
          extrapolate: 'clamp'
        })
      }, {
        [translateProp]: animatedValue.interpolate({
          inputRange: [-3, -2, -1, 0, 1],
          outputRange: [
            getTranslateFromScale(-3, card2Scale),
            getTranslateFromScale(-2, card2Scale),
            getTranslateFromScale(-1, card1Scale),
            0,
            sizeRef * 0.5
          ],
          extrapolate: 'clamp'
        })
      }]
    }
  }

  _goToDapp = () => {
    if (!MainStore.appState.selectedWallet) {
      NavStore.popupCustom.show('You have no wallet')
      return
    }
    if (!MainStore.appState.selectedWallet.canSendTransaction) {
      NavStore.popupCustom.show('Your wallet is read only')
      return
    }
    MainStore.goToDApp()
    NavStore.pushToScreen('DAppListScreen')
  }

  checkPrivateKey(privateKey) {
    return privateKey !== undefined && privateKey !== ''
  }

  render() {
    const { navigation } = this.props
    const {
      translateY
    } = this.state
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
    if (this.cards.length < 10) {
      this.cards = [...this.cards, {
        balance: '0 ETH',
        balanceUSD: '$0',
        address: '0'
      }]
    }
    const tickers = TickerStore.tickers.slice()

    return (
      <View style={styles.container}>
        <View style={styles.homeHeader}>
          <Hamburger
            style={{ flex: 0 }}
            onPressHamburger={(isShow) => {
              Animated.timing(
                translateY,
                {
                  toValue: isShow ? 1 : 0,
                  duration: 250
                }
              ).start()
            }}
          />
          <View
            style={{
              flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
            }}
          >
            <Animated.Text
              style={{
                opacity: changeOpacitySetting,
                fontSize: 20,
                color: AppStyle.mainTextColor,
                fontFamily: 'OpenSans-Bold'
              }}
            >
              {constant.SETTING}
            </Animated.Text>
            <Animated.View
              style={{
                overflow: 'hidden',
                opacity: changeOpacityListCoin,
                height: 40,
                alignItems: 'flex-end',
                justifyContent: 'center'
              }}
            >
              {/* <Ticker
                data={tickers}
                style={{
                  width: width - 77
                }}
              /> */}
              <TouchableOpacity
                style={{
                  height: 40,
                  backgroundColor: '#121734',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 20,
                  paddingLeft: 20,
                  paddingRight: 20,
                  borderRadius: 20
                }}
                onPress={this._goToDapp}
              >
                <Text style={{ color: AppStyle.mainColor, fontFamily: 'OpenSans-Semibold' }}>Đapp Browser</Text>
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
          // firstItem={this.selectedWalletIndex}
          />
        </View>
        <View
          style={styles.bottomField}
        >
          {this._renderNetwork()}
          {this._renderSendButton()}
        </View>
        <Animated.View
          style={{
            position: 'absolute',
            top: Platform.OS === 'ios' ? 81 + marginTop : 71,
            width,
            height: height - 71 + marginTop,
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
          }}
        >
          <SettingScreen
            navigation={navigation}
            onCreated={(index, isCreate, isAddress) => {
              this._carousel.snapToItem(index)
            }}
          />
        </Animated.View>
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
  }
})
