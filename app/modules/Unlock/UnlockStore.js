import { observable, action, computed } from 'mobx'
import * as Keychain from 'react-native-keychain'
import { Animated, AsyncStorage } from 'react-native'
import MainStore from '../../AppStores/MainStore'
import HapticHandler from '../../Handler/HapticHandler'
import SecureDS from '../../AppStores/DataSource/SecureDS'
import NavStore from '../../AppStores/NavStore'
import MigrateData from '../../../MigrateData'
import UnlockDS from './UnlockDS'
import AppDS from '../../AppStores/DataSource/AppDS'

const minute = 60000
class UnlockStore {
  @observable data = {
    pinTyped: 0,
    pincode: '',
    unlockDes: null,
    pinConfirm: '',
    loading: false
  }

  @observable wrongPincodeCount = 0
  @observable timeRemaining = 0

  animatedValue = new Animated.Value(0)
  isShake = false

  @action upWrongPincodeCount = () => { this.wrongPincodeCount++ }
  @action setTimeRemaining = () => {
    if (this.wrongPincodeCount === 6) {
      this.timeRemaining = minute
    } else if (this.wrongPincodeCount === 7) {
      this.timeRemaining = minute * 5
    } else if (this.wrongPincodeCount === 8) {
      this.timeRemaining = minute * 15
    } else if (this.wrongPincodeCount === 9) {
      this.timeRemaining = minute * 60
    } else {
      this.timeRemaining = 0
    }
  }

  @action countdown() {
    this.timer = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining -= 1000
        this.saveDisableData()
      } else {
        this.timer && clearInterval(this.timer)
      }
    }, 1000)
  }

  @action enraseData() {
    Keychain.resetGenericPassword()
    AppDS.enraseData()
      .then(async (res) => {
        this.resetDisable()
        MainStore.appState.resetAppState()
        await AppDS.readAppData()
        this.setup()
      })
      .catch(e => console.log(e))
  }

  @action setup() {
    console.log(MainStore.appState.hasPassword)
    const unlockDes = MainStore.appState.hasPassword ? 'Unlock your Golden' : 'Create your Pincode'
    this.setData({
      unlockDes,
      pincode: ''
    })
    AsyncStorage.getItem('USER_WALLET_ENCRYPTED').then((oldData) => {
      if (oldData) {
        this.setData({
          unlockDes: 'Unlock your Golden'
        })
      }
    })
    UnlockDS.getDisableData().then((res) => {
      if (res) {
        this.wrongPincodeCount = res.wrongPincodeCount
        this.timeRemaining = res.timeRemaining
        this.countdown()
      }
    })
  }

  @action resetDisable() {
    if (this.wrongPincodeCount === 0) {
      return
    }
    this.wrongPincodeCount = 0
    this.setTimeRemaining()
  }

  @action setData(data) {
    this.data = {
      ...this.data,
      ...data
    }
  }

  @action saveDisableData() {
    if (this.wrongPincodeCount === 0) {
      return
    }
    UnlockDS.saveDisableData({
      wrongPincodeCount: this.wrongPincodeCount,
      timeRemaining: this.timeRemaining
    })
  }

  @action async handlePress(number) {
    HapticHandler.ImpactLight()
    const { pincode, pinConfirm } = this.data
    const pinData = pincode + number
    return new Promise((resolve, reject) => {
      if (pinData.length === 6) {
        // handle check pincode
        this.setData({
          // pinTyped: pinTyped + 1,
          pincode: pinData
        })
        MigrateData.getItem('USER_WALLET_ENCRYPTED')
          .then((oldData) => {
            if (oldData) {
              this._handelMigrateData().then(res => resolve(res))
            } else if (MainStore.appState.hasPassword) {
              this._handleCheckPincode().then(res => resolve(res))
            } else if (pinConfirm === '') {
              this._handleCreatePin()
            } else if (this.data.pincode === this.data.pinConfirm) {
              this._handleConfirmPin().then(res => resolve(res))
            } else {
              this._handleErrorPin()
            }
          })
      } else {
        this.setData({
          // pinTyped: pinTyped + 1,
          pincode: pinData
        })
      }
    })
  }

  @computed get warningPincodeFail() {
    if (this.wrongPincodeCount === 0 || this.wrongPincodeCount > 5) {
      return null
    }
    return `${6 - this.wrongPincodeCount} attempts left!`
  }

  @computed get countdownMsg() {
    const { timeRemaining } = this
    const minuteNum = parseInt(timeRemaining / minute, 10)
    const secondNum = (timeRemaining - minuteNum * minute) / 1000
    const minuteStr = minuteNum < 10 ? `0${minuteNum}` : `${minuteNum}`
    const secondStr = secondNum < 10 ? `0${secondNum}` : `${secondNum}`
    return `Try again in ${minuteStr}:${secondStr}`
  }

  async _handelMigrateData() {
    return new Promise(async (resolve) => {
      const { pincode } = this.data
      const iv = await MigrateData.getIV()
      if (!iv) {
        this._handleErrorPin()
        return
      }
      const decriptData = await MigrateData.decrypData(pincode, iv, true)
      if (!decriptData) {
        this._handleErrorPin()
      } else {
        NavStore.showLoading()
        const { appState } = MainStore
        appState.setHasPassword(true)
        appState.save()
        const password = await MigrateData.getDecryptedRandomKey(pincode, iv)
        await SecureDS.forceSavePassword(password, iv, pincode)
        await SecureDS.forceSaveIV(iv)
        HapticHandler.NotificationSuccess()
        MainStore.setSecureStorage(pincode)
        await MigrateData.migrateOldData(pincode, iv, decriptData, password)
        NavStore.goBack()
        NavStore.hideLoading()
        resolve(pincode)
        this.resetDisable()
      }
    })
  }

  async _handleCheckPincode() {
    return new Promise(async (resolve) => {
      const { pincode } = this.data
      const secureDS = await SecureDS.getInstance(pincode)
      if (!secureDS) {
        this._handleErrorPin()
      } else {
        HapticHandler.NotificationSuccess()
        MainStore.setSecureStorage(pincode)
        NavStore.goBack()
        this.resetDisable()
        resolve(pincode)
      }
    })
  }

  _handleCreatePin() {
    const { pincode } = this.data
    this.setData({
      pinTyped: 0,
      pinConfirm: pincode,
      unlockDes: 'Confirm your Pincode',
      pincode: ''
    })
  }

  async _handleConfirmPin() {
    return new Promise(async (resolve) => {
      const { pincode } = this.data
      const { appState } = MainStore
      appState.setHasPassword(true)
      appState.save()
      const ds = new SecureDS(pincode)
      await Keychain.resetGenericPassword()
      ds.derivePass()
      HapticHandler.NotificationSuccess()
      MainStore.setSecureStorage(pincode)
      NavStore.goBack()
      this.resetDisable()
      resolve(pincode)
    })
  }

  _handleErrorPin(e) {
    const { animatedValue, isShake } = this
    HapticHandler.NotificationError()
    this.upWrongPincodeCount()
    this.setTimeRemaining()
    this.saveDisableData()
    if (this.wrongPincodeCount === 10) {
      this.enraseData()
    } else if (this.wrongPincodeCount > 5) {
      this.countdown()
    }

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
      this.setData({
        pinTyped: 0,
        pincode: ''
      })
    }, 250)
  }

  handleDeletePin() {
    const { pincode } = this.data
    if (pincode.length > 0) {
      this.setData({
        pincode: pincode.slice(0, -1)
      })
    }
  }
}

export default new UnlockStore()
