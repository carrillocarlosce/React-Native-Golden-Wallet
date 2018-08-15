import { observable, action, computed } from 'mobx'
import MainStore from '../../../AppStores/MainStore'
import Wallet from '../../../AppStores/stores/Wallet'
import NavStore from '../../../stores/NavStore'
import KeyStore from '../../../../Libs/react-native-golden-keystore'

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
    this.loading = true
    const title = `My wallet ${MainStore.appState.wallets.length}`
    const ds = MainStore.secureStorage
    const mnemonicWallets = []
    for (let i = 0; i < 5; i++) {
      /* eslint-disable-next-line */
      const wallet = await Wallet.importMnemonic(this.mnemonic, title, i, ds)
      mnemonicWallets.push(wallet)
    }
    this.loading = false
    this.mnemonicWallets = mnemonicWallets
    return mnemonicWallets
  }

  @action async unlockWallet() {
    if (!this.selectedWallet) {
      NavStore.popupCustom.show('No wallet have not selected')
    }
    await this.selectedWallet.save()
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
