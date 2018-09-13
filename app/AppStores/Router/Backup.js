import BackupStore from '../../modules/WalletBackup/BackupStore'
import SecureDS from '../DataSource/SecureDS'
import MainStore from '../MainStore'
import NavStore from '../NavStore'

class Backup {
  async gotoBackup(pincode) {
    MainStore.backupStore = new BackupStore()
    const mnemonic = await new SecureDS(pincode).deriveMnemonic()
    MainStore.backupStore.setMnemonic(mnemonic)
    MainStore.backupStore.setup()
    NavStore.pushToScreen('BackupStack')
  }
}

export default new Backup()
