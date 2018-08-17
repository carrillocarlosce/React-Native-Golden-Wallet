import { observable, action } from 'mobx'
import { Animated } from 'react-native'
import MainStore from '../../AppStores/MainStore'
import HapticHandler from '../../Handler/HapticHandler'
import SecureDS from '../../AppStores/DataSource/SecureDS'
import NavStore from '../../stores/NavStore'
import MigrateData from '../../../MigrateData'

class UnlockStore {
  @observable data = {
    pinTyped: 0,
    pincode: '',
    unlockDes: null,
    pinConfirm: '',
    loading: false
  }

  animatedValue = new Animated.Value(0)
  isShake = false

  @action setData(data) {
    this.data = {
      ...this.data,
      ...data
    }
  }

  @action async handlePress(number) {
    HapticHandler.ImpactLight()
    const { pinTyped, pincode, pinConfirm } = this.data
    if (pinTyped === 5) {
      // handle check pincode
      this.setData({
        pinTyped: pinTyped + 1,
        pincode: pincode + number
      })
      const oldData = await MigrateData.getItem('USER_WALLET_ENCRYPTED')
      if (oldData) {
        this._handelMigrateData()
      } else if (MainStore.appState.hasPassword) {
        this._handleCheckPincode()
      } else if (pinConfirm === '') {
        this._handleCreatePin()
      } else if (this.data.pincode === this.data.pinConfirm) {
        this._handleConfirmPin()
      } else {
        this._handleErrorPin()
      }
    } else {
      this.setData({
        pinTyped: pinTyped + 1,
        pincode: pincode + number
      })
    }
  }

  async _handelMigrateData() {
    const { pincode } = this.data
    const iv = await MigrateData.getIV()
    if (!iv) {
      this._handleErrorPin()
      return
    }
    NavStore.showLoading()
    const decriptData = await MigrateData.decrypData(pincode, iv, true)
    if (!decriptData) {
      this._handleErrorPin()
      NavStore.hideLoading()
    } else {
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
    }
  }

  async _handleCheckPincode() {
    const { pincode } = this.data
    const secureDS = await SecureDS.getInstance(pincode)
    if (!secureDS) {
      this._handleErrorPin()
    } else {
      HapticHandler.NotificationSuccess()
      MainStore.setSecureStorage(pincode)
      NavStore.goBack()
    }
  }

  _handleCreatePin() {
    const { pincode } = this.data
    this.setData({
      pinTyped: 0,
      pinConfirm: pincode,
      unlockDes: 'Confirm your PIN',
      pincode: ''
    })
  }

  async _handleConfirmPin() {
    const { pincode } = this.data
    const { appState } = MainStore
    appState.setHasPassword(true)
    appState.save()
    const ds = new SecureDS(pincode)
    ds.derivePass()
    HapticHandler.NotificationSuccess()
    MainStore.setSecureStorage(pincode)
    NavStore.goBack()
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
      this.setData({
        pinTyped: 0,
        pincode: ''
      })
    }, 250)
  }

  handleDeletePin() {
    const { pinTyped, pincode } = this.data
    if (pinTyped > 0) {
      this.setData({
        pinTyped: pinTyped - 1,
        pincode: pincode.slice(0, -1)
      })
    }
  }
}

export default UnlockStore
