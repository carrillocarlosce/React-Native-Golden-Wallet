import { observable, action, computed } from 'mobx'
import wif from 'wif'
import bigi from 'bigi'
import MainStore from '../../../AppStores/MainStore'
import { importPrivateKey } from '../../../AppStores/stores/Wallet'
import NavStore from '../../../AppStores/NavStore'
import Checker from '../../../Handler/Checker'
import NotificationStore from '../../../AppStores/stores/Notification'
import AppStyle from '../../../commons/AppStyle'
import { chainNames } from '../../../Utils/WalletAddresses'
import SecureDS from '../../../AppStores/DataSource/SecureDS'

export default class ImportPrivateKeyStore {
  @observable customTitle = ``
  @observable privKey = ''
  @observable loading = false
  @observable finished = false
  @observable focusField = ''

  @action setTitle = (title) => { this.customTitle = title }
  @action setPrivateKey = (pk) => { this.privKey = pk }
  @action setFocusField = (ff) => { this.focusField = ff }

  @computed get title() {
    return this.customTitle
  }

  @action async create(coin = chainNames.ETH) {
    NavStore.lockScreen({
      onUnlock: async (pincode) => {
        this.loading = true
        const ds = new SecureDS(pincode)

        try {
          let { privateKey } = this
          if (coin === chainNames.BTC && Checker.checkWIFBTC(this.privateKey)) {
            const decode = wif.decode(this.privateKey)
            privateKey = bigi.fromBuffer(decode.privateKey).toString(16)
          }
          const w = importPrivateKey(privateKey, this.title, ds, coin)
          if (this.addressMap[w.address]) {
            NavStore.popupCustom.show('Existed Wallet')
            this.loading = false
            return
          }
          this.finished = true
          NotificationStore.addWallet(this.title, w.address, w.type === 'ethereum' ? 'ETH' : 'BTC')
          NavStore.showToastTop(`${this.title} was successfully imported!`, {}, { color: AppStyle.colorUp })

          await MainStore.appState.appWalletsStore.addOne(w)
          MainStore.appState.autoSetSelectedWallet()
          MainStore.appState.selectedWallet.fetchingBalance()
          this.loading = false
          NavStore.reset()
          if (w.type === 'ethereum') {
            NavStore.pushToScreen('TokenScreen')
          }
        } catch (_) {
          this.loading = false
          NavStore.popupCustom.show('Invalid private key.')
        }
      }
    }, true)
  }

  @computed get isNameFocus() {
    return this.focusField === 'name'
  }

  @computed get isPrivateKeyFocus() {
    return this.focusField === 'private_key'
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

  @computed get addressMap() {
    const { wallets } = MainStore.appState
    return wallets.reduce((rs, w) => {
      const result = rs
      result[w.address] = 1
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

  @computed get isValidPrivateKey() {
    return this.privateKey !== '' && !this.isErrorPrivateKey
  }
}
