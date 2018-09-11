/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  StatusBar,
  View,
  AppState,
  Keyboard,
  NetInfo,
  Platform,
  PermissionsAndroid
} from 'react-native'
import NotificationManager from 'react-native-check-notification-enable'
import Permissions from 'react-native-permissions'
import crashlytics from 'react-native-fabric-crashlytics'
import Router from './app/Router'
import currencyStore from './app/AppStores/CurrencyStore'
import NavStore from './app/AppStores/NavStore'
import BlindScreen from './app/components/screens/BlindScreen'
import Spinner from './app/components/elements/Spinner'
import MainStore from './app/AppStores/MainStore'
import NotificationStore from './app/AppStores/stores/Notification'
import PushNotificationHelper from './app/commons/PushNotificationHelper'
import AppStyle from './app/commons/AppStyle'

console.ignoredYellowBox = ['Warning: isMounted']

export default class App extends Component {
  async componentWillMount() {
    await MainStore.startApp()
    NetInfo.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    )
  }

  async componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange)
    crashlytics.init()
    try {
      // SplashScreen.hide()
      await currencyStore.getCurrencyAPI()
    } catch (e) {
      NavStore.popupCustom.show(e.message)
      // SplashScreen.hide()
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange)
  }

  handleFirstConnectivityChange = (connection) => {
    const connectionType = connection.type === 'none' ? 'offline' : 'online'
    if (connection.type === 'none') {
      NavStore.showToastTop('No internet connection', { backgroundColor: AppStyle.errorColor }, { color: 'white' })
    }
    MainStore.appState.setInternetConnection(connectionType)
  }

  switchEnableNotification(isEnable) {
    if (MainStore.appState.internetConnection === 'offline') {
      NavStore.popupCustom.show('Network Error.')
      return
    }
    if (isEnable) {
      NotificationStore.onNotif().then(res => console.log(res))
    } else {
      NotificationStore.offNotif().then(res => console.log(res))
    }
  }

  appState = 'active'

  _handleAppStateChange = (nextAppState) => {
    if (this.appState === 'active' && nextAppState === 'inactive') {
      if (NavStore.currentRouteName !== 'UnlockScreen') {
        this.blind.showBlind()
      }
    }
    if (nextAppState === 'inactive' || nextAppState === 'background') {
      Keyboard.dismiss()
    }
    if (nextAppState === 'background') {
      NotificationStore.appState = nextAppState
    }
    if (nextAppState === 'active') {
      setTimeout(() => { NotificationStore.appState = nextAppState }, 2000)
      // MainStore.appState.BgJobs.CheckBalance.doOnce(false, false)
      MainStore.appState.BgJobs.CheckBalance.start()
      if (Platform.OS === 'ios') {
        Permissions.check('notification', { type: 'always' }).then(res => this.switchEnableNotification(res === 'authorized'))
      } else {
        NotificationManager.areNotificationsEnabled().then(res => this.switchEnableNotification(res))
      }
      this.blind.hideBlind()
    }
    if (this.appState === 'background' && nextAppState === 'active') {
      PushNotificationHelper.resetBadgeNumber()
      NavStore.lockScreen({
        onUnlock: () => {
          if (NotificationStore.isOpenFromTray) {
            NotificationStore.isOpenFromTray = false
            NotificationStore.gotoTransaction()
          }
        }
      })
    }
    this.appState = nextAppState
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
          translucent
        />
        <Router />
        <BlindScreen
          ref={(ref) => { this.blind = ref }}
        />
        <Spinner
          visible={false}
          ref={(ref) => { NavStore.loading = ref }}
        />
      </View>
    )
  }
}
