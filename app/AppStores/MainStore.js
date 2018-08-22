import { observable, action } from 'mobx'
import { AsyncStorage } from 'react-native'
import SendStore from '../modules/SendTransaction/stores/SendStore'
import SecureDS from './DataSource/SecureDS'
import AppDS from './DataSource/AppDS'
import appState from './AppState'
import UnlockStore from '../modules/Unlock/UnlockStore'
import BackupStore from '../modules/WalletBackup/BackupStore'
import PushNotificationHelper from '../commons/PushNotificationHelper'
import ChangePincodeStore from '../modules/ChangePincode/stores/ChangePincodeStore'

// do not allow change state outside action function
// configure({ enforceActions: true })

// const pincode = `111111` // for test

class MainStore {
  @observable appState = appState
  secureStorage = null
  sendTransaction = null
  unlock = null
  importStore = null
  backupStore = null
  changePincode = null

  importMnemonicStore = null

  setSecureStorage(pincode) {
    this.secureStorage = new SecureDS(pincode)
  }

  // Start
  @action async startApp() {
    await AppDS.readAppData()
    PushNotificationHelper.init()
    appState.startAllServices()
  }

  goToSendTx() {
    this.sendTransaction = new SendStore()
  }

  @action clearSendStore() {
    this.sendTransaction = null
  }

  goToChangePincode() {
    this.changePincode = new ChangePincodeStore()
  }

  async gotoUnlock() {
    this.unlock = new UnlockStore()
    let unlockDes = this.appState.hasPassword ? 'Unlock your Golden' : 'Create your Pincode'
    const oldData = await AsyncStorage.getItem('USER_WALLET_ENCRYPTED')
    if (oldData) {
      unlockDes = 'Unlock your Golden'
    }
    this.unlock.setData({
      unlockDes
    })
  }

  async gotoBackup(pincode) {
    this.backupStore = new BackupStore()
    const mnemonic = await new SecureDS(pincode).deriveMnemonic()
    this.backupStore.setMnemonic(mnemonic)
    this.backupStore.setup()
  }
}

export default new MainStore()
