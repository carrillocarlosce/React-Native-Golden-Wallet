import { observable, action } from 'mobx'
import SendStore from '../modules/SendTransaction/stores/SendStore'
import SecureDS from './DataSource/SecureDS'
import AppDS from './DataSource/AppDS'
import appState from './AppState'
import BackupStore from '../modules/WalletBackup/BackupStore'
import PushNotificationHelper from '../commons/PushNotificationHelper'
import ChangePincodeStore from '../modules/ChangePincode/stores/ChangePincodeStore'
import DAppStore from '../modules/DAppBrowser/stores/DAppStore'

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
  dapp = null

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

  goToChangePincode() {
    this.changePincode = new ChangePincodeStore()
  }

  goToDApp() {
    this.dapp = new DAppStore()
  }

  async gotoBackup(pincode) {
    this.backupStore = new BackupStore()
    const mnemonic = await new SecureDS(pincode).deriveMnemonic()
    this.backupStore.setMnemonic(mnemonic)
    this.backupStore.setup()
  }
}

export default new MainStore()
