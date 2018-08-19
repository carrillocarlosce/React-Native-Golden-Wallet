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
  NetInfo
} from 'react-native'
import crashlytics from 'react-native-fabric-crashlytics'
// import SplashScreen from 'react-native-splash-screen'
import Router from './app/Router'
import currencyStore from './app/stores/CurrencyStore'
import NavStore from './app/stores/NavStore'
import BlindScreen from './app/components/screens/BlindScreen'
import Lock from './app/components/elements/Lock'
// import TickerStore from './app/stores/TickerStore'
// import NotificationStore from './app/stores/NotificationStore'
import Spinner from './app/components/elements/Spinner'
import MainStore from './app/AppStores/MainStore'
import NotificationStore from './app/AppStores/stores/Notification'
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
      MainStore.appState.BgJobs.CheckBalance.doOnce(false, false)
      MainStore.appState.BgJobs.CheckBalance.start()
      this.blind.hideBlind()
    }
    if (this.appState === 'background' && nextAppState === 'active') {
      NavStore.lockScreen()
      // setTimeout(() => TickerStore.callApi(), 300)
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
        <Lock
          ref={(ref) => { NavStore.lock = ref }}
        />
      </View>
    )
  }
}
