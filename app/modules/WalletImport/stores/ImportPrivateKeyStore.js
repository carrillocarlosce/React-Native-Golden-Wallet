import { observable, action, computed } from 'mobx'
import MainStore from '../../../AppStores/MainStore'
import Wallet from '../../../AppStores/stores/Wallet'
import NavStore from '../../../stores/NavStore'
import Checker from '../../../Handler/Checker'

export default class ImportPrivateKeyStore {
  @observable customTitle = `My wallet ${MainStore.appState.wallets.length}`
  @observable privKey = ''
  @observable loading = false
  @observable finished = false

  @action setTitle = (title) => { this.customTitle = title }
  @action setPrivateKey = (pk) => { this.privKey = pk }

  @computed get title() {
    return this.customTitle
  }

  @action async create() {
    this.loading = true
    this.finished = true
    const ds = MainStore.secureStorage
    const w = Wallet.importPrivateKey(this.privateKey, this.title, ds)
    await w.save()
    await MainStore.appState.syncWallets()
    MainStore.appState.autoSetSelectedWallet()
    this.loading = false
    NavStore.reset()
  }

  @computed get privateKey() {
    return this.privKey
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
    const { title } = this
    return !this.finished && this.titleMap[title]
  }

  @computed get isErrorPrivateKey() {
    if (this.privateKey === '') {
      return false
    }
    return !this.finished && !Checker.checkPrivateKey(this.privateKey)
  }

  @computed get isReadyCreate() {
    return this.privateKey !== '' && this.title !== '' && !this.isErrorTitle && !this.isErrorPrivateKey
  }
}
