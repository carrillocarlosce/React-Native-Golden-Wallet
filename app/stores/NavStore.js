import { observable, action } from 'mobx'
import { Platform } from 'react-native'
import { NavigationActions } from 'react-navigation'
import SendStore from './SendTransactionStore'
import TransactionStore from './TransactionStore'

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
  @observable.ref sendModal = null
  @observable.ref transactionDetail = null
  @observable.ref createSuccessModal = null
  @observable.ref navigator = null
  @observable.ref popupCustom = null
  @observable.ref toastTop = null
  @observable.ref lock = null
  @observable.ref currentRouteName = ''
  @observable.ref loading = null
  @observable.ref preventOpenUnlockScreen = false

  showLoading() {
    this.loading && this.loading._show()
  }

  hideLoading() {
    this.loading && this.loading._hide()
  }

  @action openModal() {
    setTimeout(() => {
      this.sendModal && this.sendModal.open()
    }, 100)
  }

  @action showToastTop(content, style, styleText) {
    this.toastTop && this.toastTop.showToast(content, style, styleText)
  }

  @action closeModal() {
    SendStore.setSendingAddress('')
    SendStore.setSelectedToken(null)
    this.sendModal && this.sendModal.close()
  }

  @action lockScreen(params, shouldShowCancel = false) {
    // console.log(this.preventOpenUnlockScreen)
    if (this.currentRouteName === 'UnlockScreen' || this.currentRouteName === '' ||
      (Platform.OS === 'android' && this.currentRouteName === 'ScanQRCodeScreen' && this.preventOpenUnlockScreen)) {
      this.preventOpenUnlockScreen = false
      return
    }

    this.lock && this.lock._show(params, shouldShowCancel)
  }

  @action UnlockScreen() {
    if (this.currentRouteName === 'UnlockScreen') {
      this.reset()
    }
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
    this.navigator.dispatch(NavigationActions.navigate({
      routeName,
      params
    }))
  }

  @action onNavigationStateChange(prevState, currentState) {
    const prevScreen = getCurrentRouteName(prevState)
    const currentScreen = getCurrentRouteName(currentState)
    if (prevScreen === 'TransactionDetailScreen' && currentScreen === 'TokenScreen') {
      setTimeout(() => TransactionStore.clearTransactionMap(), 200)
    }
    this.currentRouteName = currentScreen
  }

  @action closeAllModal() {
    this.sendModal && this.sendModal.close()
    this.transactionInfoModal && this.sendModal.close()
    this.popupCustom && this.popupCustom.hide()
    this.sendingAddress = ''
    this.createSuccessModal && this.createSuccessModal.close()
  }

  @action closeTransactionDetail() {
    this.transactionDetail && this.transactionDetail.close()
  }
}

const NavStore = new ObservableNavStore()
export default NavStore
