import BigNumber from 'bignumber.js'
import { computed, action, observable } from 'mobx'
import ConfirmStore from './ConfirmStore'
import AdvanceStore from './AdvanceStore'
import { signTransaction } from '../../../api/ether-json-rpc'
import MainStore from '../../../AppStores/MainStore'
import NavStore from '../../../AppStores/NavStore'
import SecureDS from '../../../AppStores/DataSource/SecureDS'

export default class DAppStore {
  confirmStore = null
  advanceStore = null
  webview = null
  unconfirmTransaction = {}
  id = null
  @observable url = null
  @observable webviewState = {
    canGoBack: false,
    canGoForward: false
  }

  constructor() {
    this.confirmStore = new ConfirmStore()
    this.advanceStore = new AdvanceStore()
  }

  setTransaction(id, tx) {
    this.unconfirmTransaction = tx
    this.id = id
    this.goToConfirm()
  }

  setWebview(webview) {
    this.webview = webview
  }

  @action setWebviewState(state) {
    this.webviewState = state
  }

  @action setUrl(url) {
    this.url = url
  }

  @computed get canGoBack() {
    return this.webviewState.canGoBack
  }

  @computed get canGoForward() {
    return this.webviewState.canGoForward
  }

  @computed get rpcURL() {
    return MainStore.appState.config.getRPCURL()
  }

  @computed get chainId() {
    return MainStore.appState.config.chainID
  }

  @computed get fromAddress() {
    return MainStore.appState.selectedWallet.address
  }

  goBack() {
    this.webview.goBack()
  }

  goForward() {
    this.webview.goForward()
  }

  reload() {
    this.webview.reload()
  }

  loadSource() {
    this.webview.loadSource(this.url)
  }

  goToConfirm() {
    const value = new BigNumber(this.unconfirmTransaction.value || 0).div(new BigNumber(1e18))
    const gasLimit = new BigNumber(this.unconfirmTransaction.gas)
    const gasPrice = new BigNumber(this.unconfirmTransaction.gasPrice).div(new BigNumber(1e9))
    this.confirmStore.setValue(value)
    this.confirmStore.setGasLimit(gasLimit)
    this.confirmStore.setGasPrice(gasPrice)
    this.confirmStore.setToAddress(this.unconfirmTransaction.to)
  }

  getPrivateKey(ds) {
    MainStore.appState.selectedWallet.setSecureDS(ds)
    return MainStore.appState.selectedWallet.derivePrivateKey()
  }

  onCancel() {
    this.webview.executeCallback(this.id, 'User cancel this transaction!', null)
  }

  signTransaction() {
    const { value, gasLimit, gasPrice } = this.confirmStore
    this.unconfirmTransaction.value && (this.unconfirmTransaction.value = `0x${value.times(new BigNumber(1e18)).toString(16)}`)
    this.unconfirmTransaction.gas = `0x${gasLimit.toString(16)}`
    this.unconfirmTransaction.gasPrice = `0x${gasPrice.toString(16)}`

    if (MainStore.appState.internetConnection === 'offline') {
      NavStore.popupCustom.show('No internet connection')
      return
    }

    NavStore.lockScreen({
      onUnlock: (pincode) => {
        NavStore.showLoading()
        const ds = new SecureDS(pincode)
        this.getPrivateKey(ds).then((privateKey) => {
          const signedTx = signTransaction(this.unconfirmTransaction, this.chainId, privateKey)
          this.webview.executeCallback(this.id, null, signedTx)
          NavStore.hideLoading()
          NavStore.goBack()
        })
      }
    }, true)
  }

  sign(id, tx) {
    console.warn(JSON.stringify(tx))
    NavStore.lockScreen({
      onUnlock: (pincode) => {
        NavStore.showLoading()
        const ds = new SecureDS(pincode)
        this.getPrivateKey(ds).then((privateKey) => {
          const signedTx = signTransaction(tx, this.chainId, privateKey)
          console.warn(signedTx)
          this.webview.executeCallback(id, null, signedTx)
          NavStore.hideLoading()
          // NavStore.goBack()
        })
      }
    }, true)
  }
}
