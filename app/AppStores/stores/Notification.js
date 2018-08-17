import { observable, action, computed } from 'mobx'
import WalletToken from './WalletToken'
import Wallet from './Wallet'
import MainStore from '../MainStore'
import NavStore from '../../stores/NavStore'
import NotificationDS from '../DataSource/NotificationDS'
import API from '../../api'

class Notification {
  @observable currentNotif = null
  @observable tokenFromNotif = null
  lastedWalletAddress = null
  lastedTokenAddress = null
  deviceToken = null
  appState = 'background'

  saveNotifID(address, id) {
    NotificationDS.saveNotifID(address, id)
  }

  async getNotifID(address) {
    return await NotificationDS.getNotifID(address)
  }

  addWallet(name, address) {
    if (!this.deviceToken || !MainStore.appState.enableNotification) {
      return
    }
    API.addWallet(name, address, this.deviceToken).then((res) => {
      const { data, success } = res.data
      if (success) {
        this.saveNotifID(address, data.id)
      }
    })
  }

  addWallets() {
    if (!this.deviceToken) {
      return
    }
    const wallets = MainStore.appState.wallets.map((w) => {
      return {
        name: w.title,
        address: w.address
      }
    })
    API.addWallets(wallets, this.deviceToken).then((res) => {
      const { data, success } = res.data
      if (success) {
        data.forEach((d) => {
          this.saveNotifID(d.address, d.id)
        })
      }
    })
  }

  async removeWallet(address) {
    const id = await this.getNotifID(address)
    if (!id) {
      return
    }
    API.removeWallet(id)
  }

  async removeWallets() {
    MainStore.appState.wallets.forEach((w) => {
      this.removeWallet(w.address)
    })
  }

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
