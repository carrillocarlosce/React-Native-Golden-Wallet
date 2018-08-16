import { observable, action, computed } from 'mobx'
import WalletToken from './WalletToken'
import Wallet from './Wallet'
import MainStore from '../MainStore'

class Notification {
  @observable currentNotif = null
  @observable tokenFromNotif = null
  lastedWalletAddress = null
  lastedTokenAddress = null

  @action setCurrentNotif = (notif) => { this.currentNotif = notif }
  @action setTokenFromNotif = () => {
    const { selectedWallet, selectedToken } = MainStore.appState
    if (!this.notif) {
      return
    }
    if (!this.lastedWalletAddress) {
      this.lastedWalletAddress = selectedWallet.address
    }
    if (!this.lastedTokenAddress) {
      this.lastedTokenAddress = selectedToken.address
    }
    const { address, contract } = this.notif
    WalletToken.fetchTokenDetail(address, contract).then(async (token) => {
      const wallet = await Wallet.getWalletAtAddress(address)
      MainStore.appState.setSelectedWallet(wallet)
      MainStore.appState.setselectedToken(token)
      token.fetchTransactions(false)
    })
  }

  @action async resetSelectedAtAppState() {
    const prevSelectedWallet = await Wallet.getWalletAtAddress(this.lastedWalletAddress)
    prevSelectedWallet.fetchingBalance()
    const prevSelectedToken = prevSelectedWallet.getTokenAtAddress(this.lastedTokenAddress)
    MainStore.appState.setSelectedWallet(prevSelectedWallet)
    MainStore.appState.setselectedToken(prevSelectedToken)
    this.lastedWalletAddress = null
    this.lastedTokenAddress = null
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
