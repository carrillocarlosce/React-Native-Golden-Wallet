import { observable, action } from 'mobx'
import { AsyncStorage } from 'react-native'
import SendStore from '../modules/SendTransaction/stores/SendStore'
import SecureDS from './DataSource/SecureDS'
import AppDS from './DataSource/AppDS'
import appState from './AppState'
import UnlockStore from '../modules/Unlock/UnlockStore'
import BackupStore from '../modules/WalletBackup/BackupStore'
import PushNotificationHelper from '../commons/PushNotificationHelper'

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

  async gotoBackup() {
    this.backupStore = new BackupStore()
    const mnemonic = await this.secureStorage.deriveMnemonic()
    this.backupStore.setMnemonic(mnemonic)
    this.backupStore.setup()
  }
}

export default new MainStore()
