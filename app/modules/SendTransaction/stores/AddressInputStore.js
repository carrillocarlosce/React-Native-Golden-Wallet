import { observable, computed, action } from 'mobx'
import MainStore from '../../../AppStores/MainStore'
import Checker from '../../../Handler/Checker'
import API from '../../../api'

export default class AddressInputStore {
  @observable.ref amount = 0
  @observable.ref amountUSD = 0
  @observable.ref type = 'ETH'
  @observable address = ''
  @observable.ref addressModal = null
  @observable.ref qrCodeModal = null
  @observable.ref confirmModal = null
  @observable countSentTime = 0

  @observable disableSend = true

  @computed get selectedToken() {
    return MainStore.appState.selectedToken
  }

  @action setAddress(address) {
    this.address = address
  }

  @action setAddressFromQrCode(result) {

  }

  @action setDisableSend(bool) {
    this.disableSend = bool
  }

  @action validateAddress() {
    const { selectedWallet } = MainStore.appState
    this.disableSend = selectedWallet.type === 'ethereum'
      ? !Checker.checkAddress(this.address)
      : !Checker.checkAddressBTC(this.address)
    if (!this.disableSend) {
      this.checkSentTime()
    }
  }

  checkSentTime() {
    const from = MainStore.appState.selectedWallet.address
    this.getSentTime(from, this.address).then((res) => {
      if (res > 0) {
        this.setCount(res)
      }
    })
  }

  @action setCount(value) {
    this.countSentTime = value
  }

  @action setAmount(amount) {
    this.amount = amount
  }

  getSentTime(from, to) {
    return API.getSentTime(from, to).then((res) => {
      if (res.data) {
        return res.data.data
      }
      return 0
    })
  }

  @computed get amountFormated() {
    if (this.type === 'ETH') {
      return `${this.amount} ETH`
    }
    return `$${this.amountUSD}`
  }
}
