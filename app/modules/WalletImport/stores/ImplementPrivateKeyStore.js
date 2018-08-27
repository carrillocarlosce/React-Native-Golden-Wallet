import { observable, action, computed } from 'mobx'
import MainStore from '../../../AppStores/MainStore'
import NavStore from '../../../AppStores/NavStore'
import Checker from '../../../Handler/Checker'
import GetAddress, { chainNames } from '../../../Utils/WalletAddresses'

export default class ImplementPrivateKeyStore {
  @observable privKey = ''
  @observable finished = false

  @action setPrivateKey = (pk) => { this.privKey = pk }

  @action async implementPrivateKey(selectedWallet) {
    const { address } = GetAddress(this.privateKey, chainNames.ETH)
    if (selectedWallet.address !== address) {
      NavStore.popupCustom.show('This private key does not belong to your wallet')
      return
    }

    const ds = MainStore.secureStorage
    try {
      await selectedWallet.implementPrivateKey(ds, this.privateKey)
      await MainStore.appState.appWalletsStore.save()
      this.finished = true
      NavStore.goBack()
    } catch (e) {
      NavStore.popupCustom.show(e.message)
    }
  }

  @computed get privateKey() {
    return this.privKey
  }

  @computed get isErrorPrivateKey() {
    if (this.privateKey === '') {
      return false
    }
    return !this.finished && !Checker.checkPrivateKey(this.privateKey)
  }

  @computed get isReadyCreate() {
    return this.privateKey !== '' && !this.isErrorPrivateKey
  }
}
