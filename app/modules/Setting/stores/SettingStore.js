import { observable, action } from 'mobx'
import { Platform, Linking, Alert } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import * as StoreReview from 'react-native-store-review'
import constant from '../../../commons/constant'
import NavStore from '../../../AppStores/NavStore'
import MainStore from '../../../AppStores/MainStore'
import Router from '../../../AppStores/Router'

const store = Platform.OS === 'ios' ? 'App Store' : 'Google Play'
const PLAY_STORE_LINK = 'market://details?id=io.goldenwallet'

export default class SettingStore {
  @observable dataCommunity = [
    {
      mainText: 'Telegram Group',
      onPress: () => { Linking.openURL('https://t.me/goldenwallet') },
      iconRight: false
    },
    {
      mainText: 'Follow Twitter',
      onPress: () => { Linking.openURL('https://twitter.com/goldenwallet_io') },
      iconRight: false
    }
    // {
    //   mainText: 'Medium',
    //   onPress: () => { },
    //   iconRight: false
    // },
    // {
    //   mainText: 'Request Feature',
    //   onPress: () => { },
    //   iconRight: false
    // }
  ]

  @observable dataSecurity = [
    {
      mainText: 'Change Pincode',
      onPress: () => { this.showChangePincode() }
    }
  ]

  @observable dataAbout = [
    // {
    //   mainText: `Dapp Web - Do not touch`,
    //   onPress: () => { NavStore.pushToScreen('DAppWebScreen') },
    //   iconRight: false
    // },
    {
      mainText: `Rate Golden on ${store}`,
      onPress: () => { this.showPopupRating() },
      iconRight: false
    },
    {
      mainText: 'Source Code',
      onPress: () => { Linking.openURL('https://github.com/goldennetwork/golden-wallet-react-native') },
      subText: 'Github'
    },
    {
      mainText: 'Privacy & Terms',
      onPress: () => { NavStore.pushToScreen('PrivacyTermsScreen') }
    },
    {
      mainText: 'App Version',
      onPress: () => { NavStore.pushToScreen('AppVersionScreen') },
      subText: DeviceInfo.getVersion()
    }
  ]

  @action onSwitchEnableNotification() {
    const { enableSwitch } = this.dataAppSetting[1]
    this.dataAppSetting = [
      {
        mainText: 'Network',
        onPress: () => { },
        subText: 'Mainnet'
      },
      {
        mainText: 'Enable Notification',
        onPress: () => { },
        type: 'switch',
        enableSwitch: !enableSwitch
      }
    ]
  }

  showChangePincode() {
    Router.ChangePinCode.goToChangePincode()
  }

  showPopupRating() {
    if (Platform.OS === 'ios') {
      // This API is only available on iOS 10.3 or later
      if (StoreReview.isAvailable) {
        StoreReview.requestReview()
      } else {
        NavStore.popupCustom.show('Store review is not available')
      }
    } else {
      Alert.alert(
        constant.titleRatingApp,
        constant.desRatingApp,
        [
          { text: constant.ratingLater },
          { text: constant.cancel, onPress: () => { }, style: 'cancel' },
          {
            text: constant.rating,
            onPress: () => {
              Linking.openURL(PLAY_STORE_LINK)
                .catch(err => console.error('An error occurred', err))
            }
          }
        ],
        { cancelable: false }
      )
    }
  }
}
