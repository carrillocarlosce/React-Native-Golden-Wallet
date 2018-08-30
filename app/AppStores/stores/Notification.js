import { observable, action, computed } from 'mobx'
import { Platform } from 'react-native'
import WalletToken from './WalletToken'
import MainStore from '../MainStore'
import NavStore from '../../AppStores/NavStore'
import NotificationDS from '../DataSource/NotificationDS'
import API from '../../api'
import Transaction from '../../AppStores/stores/Transaction'

class Notification {
  @observable currentNotif = null
  @observable tokenFromNotif = null
  isInitFromNotification = false
  isOpenFromTray = false
  lastedWalletAddress = null
  lastedTokenAddress = null
  deviceToken = null
  appState = 'active'

  saveNotifID(address, id) {
    NotificationDS.saveNotifID(address, id)
  }

  async getNotifID(address) {
    return await NotificationDS.getNotifID(address)
  }

  addWallet(name, address) {
    if (!this.deviceToken) {
      return null
    }

    return API.addWallet(name, address, this.deviceToken).then((res) => {
      const { data, success } = res.data
      if (success) {
        this.saveNotifID(address, data.id)
      }
      return res.data
    })
  }

  addWallets() {
    if (!this.deviceToken) {
      return null
    }
    const wallets = MainStore.appState.wallets.map((w) => {
      return {
        name: w.title,
        address: w.address
      }
    })
    return API.addWallets(wallets, this.deviceToken).then((res) => {
      const { data, success } = res.data
      if (success) {
        data.wallets.forEach((d) => {
          this.saveNotifID(d.address, d.id)
        })
      }
      return res.data.success
    })
  }

  onNotif() {
    return API.onNotification(this.deviceToken)
  }

  offNotif() {
    return API.offNotification(this.deviceToken)
  }

  async removeWallet(address) {
    const id = await this.getNotifID(address)
    if (!id) {
      return null
    }
    return API.removeWallet(id)
  }

  async removeWallets() {
    const removeWalletsPromise = MainStore.appState.wallets.map(w => this.removeWallet(w.address))
    return Promise.all(removeWalletsPromise)
  }

  async editWalletName(name, address) {
    await this.removeWallet(address)
    this.addWallet(name, address).then((res) => { })
  }

  checkExistedWallet(address) {
    const wallet = MainStore.appState.wallets.find(w => w.address === address)
    if (wallet) {
      return true
    }
    return false
  }

  @action setCurrentNotif = (notif) => { this.currentNotif = notif }
  @action setDeviceToken = (dt) => { this.deviceToken = dt }
  @action setTokenFromNotif = () => {
    if (!this.notif) {
      return
    }

    const { address, contract } = this.notif
    MainStore.appState.setSelectedTransaction(null)
    WalletToken.fetchTokenDetail(address, contract).then(async (token) => {
      const wallet = MainStore.appState.wallets
        .find(w => w.address.toLowerCase() === address.toLowerCase())
      if (!wallet) {
        return
      }
      const transaction = new Transaction(this.notif, token, this.notif.status)
      MainStore.appState.setSelectedTransaction(transaction)
    })
  }

  @action gotoTransaction() {
    if (!this.notif) return
    this.setTokenFromNotif()
    if (this.notif && !this.checkExistedWallet(this.notif.address)) {
      NavStore.popupCustom.show('Wallet not Found')
      return
    }
    NavStore.pushToScreen('TransactionDetailScreen', { fromNotif: true })
  }

  @computed get notif() {
    const { currentNotif } = this
    if (!currentNotif) {
      return null
    }
    const tx = JSON.parse(currentNotif.tx)
    const content = Platform.OS === 'ios'
      ? currentNotif.aps.alert.body
      : currentNotif.fcm.body
    return {
      ...tx, content, address: currentNotif.address, contract: currentNotif.contract
    }
  }
}

export default new Notification()
