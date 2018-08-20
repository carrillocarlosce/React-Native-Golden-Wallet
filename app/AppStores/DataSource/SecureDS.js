import { AsyncStorage } from 'react-native'
import { randomBytes } from 'react-native-randombytes'
import * as Keychain from 'react-native-keychain'
import Starypto from '../../../Libs/react-native-starypto'
import MnemonicDS from './SecureMnemonicDS'
import PrivateKeyDS from './SecurePrivateKeyDS'

const dataKey = `PASSWORD`
const IVKey = `IVKey`

// Pincode --> decrypt/encrypt password
//  --> decrypt/encrypt mnemonic or private keys

export default class SecureDS {
  pincode = ''
  iv = null
  passwordRaw = null

  // Return new SecureDS
  static async getInstance(pincode) {
    const keychain = await Keychain.getGenericPassword()
    const passCipher = keychain.password
    const iv = await AsyncStorage.getItem(IVKey)

    try {
      const password = Starypto.decryptString(passCipher, pincode, iv, 'aes-256-cbc')
      return new SecureDS(pincode, false, password)
    } catch (err) {
      return null
    }
  }

  constructor(pincode, isFirstTime, passwordRaw) {
    if (!pincode) throw new Error('Pincode can not be blank')
    this.pincode = `${pincode}`
  }

  randomKey = (length = 16) => randomBytes(length).toString('hex').slice(0, length)
  _getPassword = async () => {
    const keychain = await Keychain.getGenericPassword()
    return keychain ? keychain.password : null
  }// cipher
  getIV = async () => {
    if (this.iv !== null) return this.iv

    let iv = await AsyncStorage.getItem(IVKey)
    if (!iv) {
      iv = this.randomKey()
      await AsyncStorage.setItem(IVKey, iv)
    }

    this.iv = iv
    return iv
  }

  static forceSavePassword(password, iv, pincode) {
    const randomStrEncrypted = Starypto.encryptString(password, pincode, iv, 'aes-256-cbc')
    return Keychain.setGenericPassword(dataKey, randomStrEncrypted)
  }

  static forceSaveIV(iv) {
    return AsyncStorage.setItem(IVKey, iv)
  }

  async hasSetupPincode() {
    return this._getPassword()
  }

  _deriveNew = (iv) => {
    const password = this.randomKey()

    const randomStrEncrypted = Starypto.encryptString(password, this.pincode, iv, 'aes-256-cbc')
    // AsyncStorage.setItem(dataKey, randomStrEncrypted)
    Keychain.setGenericPassword(dataKey, randomStrEncrypted)
    return password
  }

  _deriveOld = (iv, password) => {
    return Starypto.decryptString(password, this.pincode, iv, 'aes-256-cbc')
  }

  derivePass = async () => {
    const passCipher = await this._getPassword()
    const iv = await this.getIV()

    if (!passCipher) return { password: this._deriveNew(iv), iv }
    return { password: this._deriveOld(iv, passCipher), iv }
  }

  deriveMnemonic = async () => {
    if (!this.iv) await this.getIV()

    const { iv, password } = await this.derivePass()
    const mnemonicDS = new MnemonicDS(password, iv)
    return await mnemonicDS.derive()
  }

  derivePrivateKey = async (address) => {
    if (!this.iv) await this.getIV()

    const { iv, password } = await this.derivePass()
    const privateKeyDS = new PrivateKeyDS(password, iv)
    return await privateKeyDS.getPrivateKey(address)
  }

  savePrivateKey = async (address, privateKey) => {
    if (!this.iv) await this.getIV()

    const { iv, password } = await this.derivePass()
    const privateKeyDS = new PrivateKeyDS(password, iv)
    await privateKeyDS.savePrivateKey(address, privateKey)
  }

  removePrivateKey = async (address) => {
    if (!this.iv) await this.getIV()

    const { iv, password } = await this.derivePass()
    const privateKeyDS = new PrivateKeyDS(password, iv)
    await privateKeyDS.deletePrivateKey(address)
  }

  clearAllData = async () => {
    if (!this.iv) await this.getIV()
    const { iv, password } = await this.derivePass()

    // AsyncStorage.removeItem(dataKey)
    Keychain.resetGenericPassword()
    AsyncStorage.removeItem(IVKey)

    await new PrivateKeyDS(password, iv).clearAllData()
    await new MnemonicDS(password, iv).remove()
  }
}
