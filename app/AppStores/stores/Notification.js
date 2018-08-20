import { observable, action, computed } from 'mobx'
import { Platform } from 'react-native'
import WalletToken from './WalletToken'
import Wallet from './Wallet'
import MainStore from '../MainStore'
import NavStore from '../../AppStores/NavStore'
import NotificationDS from '../DataSource/NotificationDS'
import API from '../../api'

class Notification {
  @observable currentNotif = null
  @observable tokenFromNotif = null
  isInitFromNotification = false
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
    if (!this.deviceToken || !MainStore.appState.enableNotification) {
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
        data.forEach((d) => {
          this.saveNotifID(d.address, d.id)
        })
      }
      return res.data.success
    })
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
    this.addWallet(name, address).then(res => console.warn(res))
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
      if (!wallet) {
        return
      }
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
      if (this.notif && !this.checkExistedWallet(this.notif.address)) {
        NavStore.popupCustom.show('Wallet not Found')
        if (this.isInitFromNotification) {
          NavStore.lockScreen({
            onUnlock: (pincode) => {
              this.isInitFromNotification = false
              MainStore.setSecureStorage(pincode)
            }
          })
        }
        return
      }
      NavStore.pushToScreen('TransactionListScreen', { fromNotif: true })
    }, 500)
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
