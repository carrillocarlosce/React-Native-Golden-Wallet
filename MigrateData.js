import { AsyncStorage } from 'react-native'
import { randomBytes } from 'react-native-randombytes'
import * as Keychain from 'react-native-keychain'
import Starypto from './Libs/react-native-starypto'
import MainStore from './app/AppStores/MainStore'
import Wallet from './app/AppStores/stores/Wallet'
import { encryptString, decryptString } from './app/Utils/DataCrypto'

const KeyLocal = {
  PIN_CODE: 'PIN_CODE',
  IV_CODE: 'IV',
  DATA_ENCRYPTED: 'USER_WALLET_ENCRYPTED'
}

class MigrateData {
  getRandomKeyFromKeychain = async (pinCode, iv) => {
    const credentials = await Keychain.getGenericPassword()
    if (!(credentials && credentials.username)) {
      const randomStr = randomBytes(16).toString('hex').slice(0, 16)
      const randomStrEncrypted = encryptString(randomStr, pinCode, iv, 'aes-256-cbc')
      Keychain.setGenericPassword(KeyLocal.IV_CODE, randomStrEncrypted)
      return randomStrEncrypted
    }
    let randomKey = credentials.password
    if (randomKey.length === 16) {
      randomKey = encryptString(randomKey, pinCode, iv, 'aes-256-cbc')
      Keychain.setGenericPassword(KeyLocal.IV_CODE, randomKey)
    }
    return randomKey
  }

  getDataEncrypFromStorage = async () => {
    const dataEncrypted = await this.getItem(KeyLocal.DATA_ENCRYPTED)
    return dataEncrypted
  }

  getDecryptedRandomKey = async (pinCode, iv) => {
    const dataEncrypted = await this.getRandomKeyFromKeychain(pinCode, iv)
    const dataDecrypted = decryptString(dataEncrypted, pinCode, iv, 'aes-256-cbc')
    this.randomKey = dataDecrypted
    return dataDecrypted
  }

  decrypData = (pinCode, iv, shouldLoadData = true) => {
    return new Promise(async (resolve, reject) => {
      try {
        const randomKeyDecrypted = await this.getDecryptedRandomKey(pinCode, iv)
        const dataEncryptedFromStorage = await this.getDataEncrypFromStorage()
        if (!dataEncryptedFromStorage) {
          return resolve()
        }
        const dataDecrypted = decryptString(dataEncryptedFromStorage, randomKeyDecrypted, iv, 'aes-256-cbc')
        if (shouldLoadData) {
          // WalletStore.fetchUserWallet(dataDecrypted)
        }
        return resolve(dataDecrypted)
      } catch (e) {
        return reject(e)
      }
    })
  }

  async getIV() {
    return this.getItem(KeyLocal.IV_CODE)
  }

  handleCreateWallet(wlObj, ds) {
    const wallet = new Wallet(wlObj, ds)
    wallet.title = wlObj.cardName
    wallet.didBackup = wlObj.isBackup ? true : false
    return wallet
  }

  async migrateOldData(pincode, iv, decriptData, password) {
    const oldDataEncript = await this.getDataEncrypFromStorage()
    if (!oldDataEncript) return

    // const iv = await this.getIV()
    // if (!iv) return

    // const decriptData = await this.decrypData(pincode, iv, true)
    // if (!decriptData) return

    try {
      const decriptDataObj = JSON.parse(decriptData)

      const secureDS = MainStore.secureStorage
      const tmpWallets = decriptDataObj.ethWallets ? decriptDataObj.ethWallets : []
      if (decriptDataObj.mnemonic && tmpWallets.length > 0) {
        const mnemonicCipher = encryptString(decriptDataObj.mnemonic, password, iv, 'aes-256-cbc')
        await AsyncStorage.setItem('secure-mnemonic', mnemonicCipher)
        const mnWallets = await Wallet.getWalletsFromMnemonic(decriptDataObj.mnemonic)

        for (let j = 0; j < tmpWallets.length; j++) {
          const index = mnWallets.findIndex(item => item.address.toLowerCase() === tmpWallets[j].address.toLowerCase())
          tmpWallets[j].index = index
        }
      }
      for (let i = 0; i < tmpWallets.length; i++) {
        let wallet = {}
        const item = tmpWallets[i]
        if (item.index >= 0) {
          wallet = this.handleCreateWallet(item, secureDS)
          MainStore.appState.setCurrentWalletIndex(item.index + 1)
        } else {
          if (item.importType === 'Address') {
            wallet = Wallet.importAddress(item.address, item.cardName, secureDS)
          }
          if (item.importType !== 'Address' && item.privateKey) {
            wallet = Wallet.importPrivateKey(item.privateKey, item.cardName, secureDS)
          }
        }
        await wallet.save()
      }

      AsyncStorage.removeItem(KeyLocal.DATA_ENCRYPTED)
      MainStore.appState.save()
      MainStore.appState.appWalletsStore.getWalletFromDS()
    } catch (error) {
      // console.error(error)
    }
  }

  saveItem = async (key, value) => {
    await AsyncStorage.setItem(key, value)
  }

  getItem = async (key) => {
    const dataLocal = await AsyncStorage.getItem(key)
    return dataLocal
  }
}

const migrateData = new MigrateData()
export default migrateData
