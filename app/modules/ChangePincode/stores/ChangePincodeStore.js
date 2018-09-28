import { observable, computed, action } from 'mobx'
import { AsyncStorage, Animated } from 'react-native'
import * as Keychain from 'react-native-keychain'
import HapticHandler from '../../../Handler/HapticHandler'
import SecureDS from '../../../AppStores/DataSource/SecureDS'
import NavStore from '../../../AppStores/NavStore'
import { decryptString } from '../../../Utils/DataCrypto'

const IVKey = `IVKey`

export default class ChangePincodeStore {
  oldPincode = ''
  newPincode = ''
  @observable pinCode = ''
  @observable confirmPincode = ''
  @observable type = 0
  @observable canPress = true

  animatedValue = new Animated.Value(0)
  isShake = false

  @computed get pinTyped() {
    const pinTyped = this.pinCode.length
    return pinTyped
  }

  @action handlePress(number) {
    if (!this.canPress) return false
    HapticHandler.ImpactLight()
    if (this.pinTyped === 5) {
      this.canPress = false
      this.pinCode = `${this.pinCode}${number}`
      this.onFullFill()
      return true
    }
    if (this.pinTyped < 5) {
      this.pinCode = `${this.pinCode}${number}`
      return true
    }
    return false
  }

  @action handleBackSpace() {
    if (!this.canPress) return
    HapticHandler.ImpactLight()
    if (this.pinCode.length > 0) {
      this.pinCode = this.pinCode.slice(0, -1)
    }
  }

  _handleErrorPin(e) {
    const { animatedValue, isShake } = this
    HapticHandler.NotificationError()

    Animated.spring(
      animatedValue,
      {
        toValue: isShake ? 0 : 1,
        duration: 250,
        tension: 80,
        friction: 4
      }
    ).start()
    setTimeout(() => {
      this.isShake = !isShake
      this.canPress = true
      this.clearPincode()
    }, 500)
  }

  @action clearPincode() {
    this.pinCode = ''
  }

  @action async _handleCheckPincode() {
    const { pinCode } = this
    const secureDS = await SecureDS.getInstance(pinCode)
    if (!secureDS) {
      this._handleErrorPin()
    } else {
      HapticHandler.NotificationSuccess()
      this.oldPincode = this.pinCode
      this.type = 1
      this.clearPincode()
    }
    this.canPress = true
  }

  @action _handleCreatePin() {
    this.confirmPincode = this.pinCode
    this.type = 2
    this.clearPincode()
    this.canPress = true
  }

  @action _handleConfirmPin() {
    if (this.confirmPincode === this.pinCode) {
      this.newPincode = this.pinCode
      NavStore.showLoading()
      this._encriptDataWithNewPincode()
    } else {
      this._handleErrorPin()
    }
  }

  onFullFill() {
    switch (this.type) {
      case 0:
        this._handleCheckPincode()
        break

      case 1:
        this._handleCreatePin()
        break

      case 2:
        this._handleConfirmPin()
        break

      default:
        break
    }
  }

  @computed get title() {
    switch (this.type) {
      case 0:
        return 'Enter your old PIN Code'

      case 1:
        return 'Set your new PIN Code'

      case 2:
        return 'Confirm your PIN Code'

      default:
        return ''
    }
  }

  getPasswordFromKeychain = async () => {
    const credentials = await Keychain.getGenericPassword()
    const randomKey = credentials.password
    return randomKey
  }

  decryptData(dataEncrypted, pinCode, iv) {
    const dataDecrypted = decryptString(dataEncrypted, pinCode, iv, 'aes-256-cbc')
    return dataDecrypted
  }

  async getIV() {
    return this.getItem(IVKey)
  }

  async _encriptDataWithNewPincode() {
    try {
      const iv = await this.getIV()
      const encryptPassword = await this.getPasswordFromKeychain()
      const password = this.decryptData(encryptPassword, this.oldPincode, iv)
      if (password && password.length === 16) {
        SecureDS.forceSavePassword(password, iv, this.newPincode)
        HapticHandler.NotificationSuccess()
        NavStore.goBack()
        NavStore.hideLoading()
      } else {
        alert('Wrong pincode')
        NavStore.hideLoading()
      }
    } catch (error) {
      NavStore.hideLoading()
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
