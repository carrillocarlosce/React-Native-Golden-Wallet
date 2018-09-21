import { observable, action, computed } from 'mobx'
import MainStore from '../../../AppStores/MainStore'
import { importAddress } from '../../../AppStores/stores/Wallet'
import NavStore from '../../../AppStores/NavStore'
import Checker from '../../../Handler/Checker'
import constant from '../../../commons/constant'
import NotificationStore from '../../../AppStores/stores/Notification'
import AppStyle from '../../../commons/AppStyle'
import { chainNames } from '../../../Utils/WalletAddresses'

export default class ImportAddressStore {
  @observable customTitle = ``
  @observable addessWallet = ''
  @observable loading = false
  @observable finished = false
  @observable focusField = ''
  coin = chainNames.ETH

  @action setFocusField = (ff) => { this.focusField = ff }
  @action setCoin = (c) => { this.coin = c }
  @action setTitle(title) {
    this.customTitle = title
  }

  @action setAddress(address) {
    this.addessWallet = address
  }

  @action async create(title, coin = chainNames.ETH) {
    this.loading = true
    this.finished = true
    const ds = MainStore.secureStorage
    const { address } = this
    const w = importAddress(address, title, ds, coin)
    NotificationStore.addWallet(title, w.address)
    NavStore.showToastTop(`${title} was successfully imported!`, {}, { color: AppStyle.colorUp })
    await MainStore.appState.appWalletsStore.addOne(w)
    MainStore.appState.autoSetSelectedWallet()
    MainStore.appState.selectedWallet.fetchingBalance()
    this.loading = false
    NavStore.reset()
    NavStore.pushToScreen('TokenScreen', { shouldShowAlertBackup: false })
  }

  @computed get isNameFocus() {
    return this.focusField === 'name'
  }

  @computed get isAddressFocus() {
    return this.focusField === 'address'
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
    if (this.address !== '' && !this.finished && !Checker.checkAddress(this.address, this.coin)) {
      return constant.INVALID_ADDRESS
    }

    if (this.coin === chainNames.ETH && !this.finished && this.addressMap[this.address.toLowerCase()]) {
      return constant.EXISTED_WALLET
    }

    if (this.coin === chainNames.BTC && !this.finished && this.addressMap[this.address]) {
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
