import { AsyncStorage } from 'react-native'
import Keystore from '../../../Libs/react-native-golden-keystore'
import { encryptString, decryptString } from '../../Utils/DataCrypto'

const dataKey = `secure-mnemonic`

class SecureMnemonicDS {
  password = ''
  iv = ''

  constructor(password, iv) {
    this.password = password
    this.iv = iv
  }

  generateNew = () => Keystore.generateMnemonic()

  derive = async () => {
    const mnemonicCipher = await AsyncStorage.getItem(dataKey)
    if (!mnemonicCipher) return await this._deriveNew()

    return await this._deriveOld(mnemonicCipher)
  }

  remove = () => AsyncStorage.removeItem(dataKey)

  _deriveNew = async () => {
    const mnemonic = await this.generateNew()
    const mnemonicCipher = encryptString(mnemonic, this.password, this.iv, 'aes-256-cbc')
    await AsyncStorage.setItem(dataKey, mnemonicCipher)

    return mnemonic
  }

  _deriveOld = async (mnemonicCipher) => {
    return decryptString(mnemonicCipher, this.password, this.iv, 'aes-256-cbc')
  }
}

export default SecureMnemonicDS
