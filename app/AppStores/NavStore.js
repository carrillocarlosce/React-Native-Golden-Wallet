import { observable, action } from 'mobx'
import { Platform } from 'react-native'
import Permissions from 'react-native-permissions'
import { NavigationActions } from 'react-navigation'

// gets the current screen from navigation state
function getCurrentRouteName(navigationState) {
  if (!navigationState) {
    return null
  }
  const route = navigationState.routes[navigationState.index]
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRouteName(route)
  }
  return route.routeName
}

class ObservableNavStore {
  @observable.ref navigator = null
  @observable.ref popupCustom = null
  @observable.ref toastTop = null
  currentRouteName = ''
  @observable.ref loading = null
  @observable.ref preventOpenUnlockScreen = false
  @observable triggerRenderAndroid = false
  @observable.ref shouldReloadCamera = false

  showLoading() {
    this.loading && this.loading._show()
  }

  hideLoading() {
    this.loading && this.loading._hide()
  }

  @action showToastTop(content, style, styleText) {
    this.toastTop && this.toastTop.showToast(content, style, styleText)
  }

  @action lockScreen(params, shouldShowCancel = false) {
    const additionalCondition = this.currentRouteName === 'ScanQRCodeScreen' || this.currentRouteName === 'HomeScreen' || this.currentRouteName === 'TransactionDetailScreen'
    if (this.currentRouteName === '' ||
      (Platform.OS === 'android' && additionalCondition && this.preventOpenUnlockScreen)) {
      this.preventOpenUnlockScreen = false
      return
    }

    if ((Platform.OS === 'android' && this.currentRouteName === 'ScanQRCodeScreen' && !this.preventOpenUnlockScreen)) {
      Permissions.check('camera').then((res) => {
        if (res == 'authorized') {
          this.shouldReloadCamera = true
          this.triggerRenderAndroid = !this.triggerRenderAndroid
        }
      })
    }
    this.popupCustom.hide()
    this.pushToScreen('UnlockScreen', { ...params, shouldShowCancel })
  }

  @action reset() {
    const resetAction = {
      type: NavigationActions.NAVIGATE,
      routeName: 'HomeStack',
      action: {
        type: NavigationActions.RESET,
        index: 0,
        actions: [{ type: NavigationActions.NAVIGATE, routeName: 'HomeStack' }]
      }
    }
    this.navigator.dispatch(resetAction)
  }

  @action goBack() {
    this.navigator.dispatch(NavigationActions.back())
  }

  @action pushToScreen(routeName, params = null) {
    this.navigator && this.navigator.dispatch(NavigationActions.navigate({
      routeName,
      params
    }))
  }

  @action onNavigationStateChange(prevState, currentState) {
    const currentScreen = getCurrentRouteName(currentState)
    this.currentRouteName = currentScreen
  }
}

const NavStore = new ObservableNavStore()
export default NavStore
