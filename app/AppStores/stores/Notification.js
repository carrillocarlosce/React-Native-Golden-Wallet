import { observable, action, computed } from 'mobx'
import WalletToken from './WalletToken'
import Wallet from './Wallet'
import MainStore from '../MainStore'
import NavStore from '../../stores/NavStore'

class Notification {
  @observable currentNotif = null
  @observable tokenFromNotif = null
  lastedWalletAddress = null
  lastedTokenAddress = null
  deviceToken = null
  appState = 'background'

  @action setCurrentNotif = (notif) => { this.currentNotif = notif }
  @action setDeviceToken = (dt) => { this.deviceToken = dt }
  @action setTokenFromNotif = () => {
    const { selectedWallet, selectedToken } = MainStore.appState
    if (!this.notif) {
      return
    }
    if (!this.lastedWalletAddress && selectedWallet) {
      this.lastedWalletAddress = selectedWallet.address
    }
    if (!this.lastedTokenAddress && selectedToken) {
      this.lastedTokenAddress = selectedToken.address
    }
    const { address, contract } = this.notif
    MainStore.appState.setselectedToken(null)
    WalletToken.fetchTokenDetail(address, contract).then(async (token) => {
      const wallet = await Wallet.getWalletAtAddress(address)
      MainStore.appState.setSelectedWallet(wallet)
      MainStore.appState.setselectedToken(token)
      token.fetchTransactions(false)
    })
  }

  @action async resetSelectedAtAppState() {
    if (!this.lastedWalletAddress) {
      return
    }
    const prevSelectedWallet = await Wallet.getWalletAtAddress(this.lastedWalletAddress)
    // prevSelectedWallet.fetchingBalance()
    const prevSelectedToken = prevSelectedWallet.getTokenAtAddress(this.lastedTokenAddress)
    this.lastedWalletAddress = null
    this.lastedTokenAddress = null
    MainStore.appState.setSelectedWallet(prevSelectedWallet)
    setTimeout(() => {
      MainStore.appState.setselectedToken(prevSelectedToken)
    }, 250)
  }

  @action gotoTransactionList() {
    NavStore.closeTransactionDetail()
    setTimeout(() => {
      this.setTokenFromNotif()
      NavStore.pushToScreen('TransactionListScreen', { fromNotif: true })
    }, 500)
  }

  @computed get notif() {
    const { currentNotif } = this
    if (!currentNotif) {
      return null
    }
    const tx = JSON.parse(currentNotif.tx)
    return {
      ...tx, content: currentNotif.fcm.body, address: currentNotif.address, contract: currentNotif.contract
    }
  }
}

export default new Notification()
