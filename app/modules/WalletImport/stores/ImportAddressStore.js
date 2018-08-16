import { observable, action, computed } from 'mobx'
import MainStore from '../../../AppStores/MainStore'
import Wallet from '../../../AppStores/stores/Wallet'
import NavStore from '../../../stores/NavStore'
import Checker from '../../../Handler/Checker'
import constant from '../../../commons/constant'
import NotificationStore from '../../../AppStores/stores/Notification'

export default class ImportAddressStore {
  @observable customTitle = `My wallet ${MainStore.appState.wallets.length}`
  @observable addessWallet = ''
  @observable loading = false
  @observable finished = false

  @action setTitle(title) {
    this.customTitle = title
  }

  @action setAddress(address) {
    this.addessWallet = address
  }

  @action async create(title) {
    this.loading = true
    this.finished = true
    const ds = MainStore.secureStorage
    const { address } = this
    const w = Wallet.importAddress(address, title, ds)
    NotificationStore.addWallet(title, w.address)
    await w.save()
    await MainStore.appState.syncWallets()
    MainStore.appState.autoSetSelectedWallet()
    this.loading = false
    NavStore.reset()
  }

  @computed get title() {
    return this.customTitle
  }

  @computed get address() {
    return this.addessWallet
  }

  @computed get addressMap() {
    const { wallets } = MainStore.appState
    return wallets.reduce((rs, w) => {
      const result = rs
      result[w.address] = 1
      return result
    }, {})
  }

  @computed get titleMap() {
    const { wallets } = MainStore.appState
    return wallets.reduce((rs, w) => {
      const result = rs
      result[w.title] = 1
      return result
    }, {})
  }

  @computed get isErrorTitle() {
    const title = this.customTitle
    return !this.finished && this.titleMap[title]
  }

  @computed get titleIsEmpty() {
    return this.customTitle.trim() === ''
  }

  @computed get errorAddress() {
    if (this.address !== '' && !this.finished && !Checker.checkAddress(this.address)) {
      return constant.INVALID_ADDRESS
    }

    if (!this.finished && this.addressMap[this.address]) {
      return constant.EXISTED_WALLET
    }
    return ''
  }

  @computed get isReadyCreate() {
    return this.address !== '' && this.title !== '' &&
      this.errorAddress === '' && !this.isErrorTitle &&
      !this.titleIsEmpty
  }
}
