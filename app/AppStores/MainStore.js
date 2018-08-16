import { observable, action } from 'mobx'
import SendStore from '../modules/SendTransaction/stores/SendStore'
import SecureDS from './DataSource/SecureDS'
import AppDS from './DataSource/AppDS'
import appState from './AppState'
import UnlockStore from '../modules/Unlock/UnlockStore'
import ImportStore from '../modules/WalletImport/stores/ImportStore'
import BackupStore from '../modules/WalletBackup/BackupStore'
import AddressBookStore from '../modules/AddressBook/AddressBookStore'
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
  addressBookStore = null

  setSecureStorage(pincode) {
    this.secureStorage = new SecureDS(pincode)
  }

  // Start
  @action async startApp() {
    PushNotificationHelper.init()
    await AppDS.readAppData()
    appState.startAllServices()
  }

  goToSendTx() {
    this.sendTransaction = new SendStore()
  }

  @action clearSendStore() {
    this.sendTransaction = null
  }

  gotoUnlock() {
    this.unlock = new UnlockStore()
    const unlockDes = this.appState.hasPassword ? 'Unlock with your PIN' : 'Create your PIN'
    this.unlock.setData({
      unlockDes
    })
  }

  gotoImport() {
    this.importStore = new ImportStore()
  }

  async gotoBackup() {
    this.backupStore = new BackupStore()
    const mnemonic = await this.secureStorage.deriveMnemonic()
    this.backupStore.setMnemonic(mnemonic)
  }

  gotoAddressBook() {
    this.addressBookStore = new AddressBookStore()
  }
}

export default new MainStore()
