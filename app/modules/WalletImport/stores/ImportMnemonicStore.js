import { observable, action, computed, toJS } from 'mobx'
import MainStore from '../../../AppStores/MainStore'
import Wallet from '../../../AppStores/stores/Wallet'
import NavStore from '../../../AppStores/NavStore'
import KeyStore from '../../../../Libs/react-native-golden-keystore'
import constant from '../../../commons/constant'
import NotificationStore from '../../../AppStores/stores/Notification'
import AppStyle from '../../../commons/AppStyle'

export default class ImportMnemonicStore {
  @observable customTitle = ``
  @observable mnemonicPhrase = ''
  @observable mnemonicWallets = []
  @observable loading = false
  @observable selectedWallet = null
  @observable isErrorMnemonic = false
  stopCheckTitle = false

  @action setTitle = (title) => { this.customTitle = title }
  @action onChangeMnemonic = (mn) => {
    this.mnemonicPhrase = mn
    if (this.mnemonicPhrase !== '') {
      KeyStore.mnemonicIsValid(this.mnemonic).then((isValidate) => {
        this.isErrorMnemonic = isValidate == 0
      })
    } else {
      this.isErrorMnemonic = false
    }
  }

  @action setSelectedWallet = (w) => { this.selectedWallet = w }

  @computed get title() {
    return this.customTitle
  }

  @action async generateWallets() {
    this.loading = true
    this.mnemonicWallets = await Wallet.getWalletsFromMnemonic(this.mnemonic, undefined, 0, 9)
    this.loading = false
    return this.mnemonicWallets
  }

  get walletIsExisted() {
    return MainStore.appState.wallets.find(w => w.address === this.selectedWallet.address)
  }

  @action gotoEnterName() {
    this.stopCheckTitle = false
    this.customTitle = ''

    if (!this.selectedWallet) {
      NavStore.popupCustom.show('No wallet have not selected.')
      return
    }

    if (this.walletIsExisted) {
      NavStore.popupCustom.show(constant.EXISTED_WALLET)
      return
    }
    NavStore.pushToScreen('EnterNameViaMnemonic')
  }

  @action async unlockWallet() {
    this.stopCheckTitle = true

    const index = this.mnemonicWallets
      .findIndex(w => w.address.toLowerCase() === this.selectedWallet.address.toLowerCase())
    const title = this.customTitle

    const ds = MainStore.secureStorage
    const wallet = await Wallet.unlockFromMnemonic(this.mnemonic, title, index, ds)
    NotificationStore.addWallet(title, wallet.address)
    NavStore.showToastTop(`${this.title} was successfully imported!`, {}, { color: AppStyle.colorUp })

    await MainStore.appState.appWalletsStore.addOne(wallet)
    MainStore.appState.autoSetSelectedWallet()
    MainStore.appState.selectedWallet.fetchingBalance()
    NavStore.reset()
    NavStore.pushToScreen('TokenScreen', { shouldShowAlertBackup: false })
  }

  @computed get isLoading() {
    return this.loading
  }

  @computed get mnemonic() {
    return this.mnemonicPhrase
  }

  @computed get errorMnemonic() {
    return this.isErrorMnemonic
  }

  @computed get isReadyCreate() {
    return !this.errorMnemonic && this.mnemonic !== ''
  }

  @computed get isReadyUnlock() {
    return !this.titleIsExisted && this.title !== ''
  }

  @computed get titleIsExisted() {
    return !this.stopCheckTitle && MainStore.appState.wallets.find(w => w.title === this.title)
  }
}
