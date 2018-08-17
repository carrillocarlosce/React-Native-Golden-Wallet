import { observable, action, computed } from 'mobx'
import MainStore from '../../../AppStores/MainStore'
import Wallet from '../../../AppStores/stores/Wallet'
import NavStore from '../../../stores/NavStore'
import KeyStore from '../../../../Libs/react-native-golden-keystore'
import constant from '../../../commons/constant'
import NotificationStore from '../../../AppStores/stores/Notification'

export default class ImportMnemonicStore {
  @observable customTitle = `My wallet ${MainStore.appState.wallets.length}`
  @observable mnemonicPhrase = ''
  @observable mnemonicWallets = []
  @observable loading = false
  @observable selectedWallet = null
  @observable isErrorMnemonic = false

  @action setTitle = (title) => { this.customTitle = title }
  @action onChangeMnemonic = (mn) => {
    this.mnemonicPhrase = mn
    if (this.mnemonicPhrase !== '') {
      KeyStore.mnemonicIsValid(this.mnemonic).then((isValidate) => {
        console.log(isValidate)
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
    // this.loading = true
    // this.loading = false
    this.mnemonicWallets = await Wallet.getWalletsFromMnemonic(this.mnemonic)
    return this.mnemonicWallets
  }

  get walletIsExisted() {
    return MainStore.appState.wallets.find(w => w.address === this.selectedWallet.address)
  }

  @action async unlockWallet() {
    if (!this.selectedWallet) {
      NavStore.popupCustom.show('No wallet have not selected.')
      return
    }

    if (this.walletIsExisted) {
      NavStore.popupCustom.show(constant.EXISTED_WALLET)
      return
    }

    const index = this.mnemonicWallets
      .findIndex(w => w.address.toLowerCase() === this.selectedWallet.address.toLowerCase())
    const title = `My wallet ${MainStore.appState.wallets.length}`
    const ds = MainStore.secureStorage
    const wallet = await Wallet.unlockFromMnemonic(this.mnemonic, title, index, ds)
    NotificationStore.addWallet(title, wallet.address)
    await wallet.save()
    await MainStore.appState.syncWallets()
    MainStore.appState.autoSetSelectedWallet()
    NavStore.reset()
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
}
