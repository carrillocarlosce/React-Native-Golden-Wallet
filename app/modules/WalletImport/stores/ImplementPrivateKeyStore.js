import { observable, action, computed } from 'mobx'
import wif from 'wif'
import bigi from 'bigi'
import MainStore from '../../../AppStores/MainStore'
import NavStore from '../../../AppStores/NavStore'
import Checker from '../../../Handler/Checker'
import GetAddress, { chainNames } from '../../../Utils/WalletAddresses'
import SecureDS from '../../../AppStores/DataSource/SecureDS'

export default class ImplementPrivateKeyStore {
  @observable privKey = ''
  @observable finished = false

  @action setPrivateKey = (pk) => { this.privKey = pk }

  @action async implementPrivateKey(selectedWallet) {
    NavStore.lockScreen({
      onUnlock: async (pincode) => {
        const coin = selectedWallet.type === 'ethereum' ? chainNames.ETH : chainNames.BTC
        let { privateKey } = this
        if (coin === chainNames.BTC && Checker.checkWIFBTC(this.privateKey)) {
          const decode = wif.decode(this.privateKey)
          privateKey = bigi.fromBuffer(decode.privateKey).toString(16)
        }
        const { address } = GetAddress(privateKey, coin)
        if (selectedWallet.address.toLowerCase() !== address.toLowerCase()) {
          NavStore.popupCustom.show('This private key does not belong to your wallet')
          return
        }

        const ds = new SecureDS(pincode)
        try {
          await selectedWallet.implementPrivateKey(ds, privateKey)
          await MainStore.appState.appWalletsStore.save()
          this.finished = true
          NavStore.goBack()
        } catch (e) {
          NavStore.popupCustom.show(e.message)
        }
      }
    }, true)
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
