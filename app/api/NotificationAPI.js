import DeviceInfo from 'react-native-device-info'
import ApiCaller from './api-caller'

export const addWallet = (name, address, deviceToken) => {
  const data = {
    name, address, device_token: deviceToken, device_udid: DeviceInfo.getUniqueID()
  }
  return ApiCaller.post('http://wallet.skylab.vn/wallets', data, true)
}

export const removeWallet = (id) => {
  return ApiCaller.delete(`http://wallet.skylab.vn/wallets/${id}`, {}, false)
}

export const addWallets = (wallets, deviceToken) => {
  const data = {
    wallets, device_token: deviceToken, device_udid: DeviceInfo.getUniqueID()
  }
  return ApiCaller.post('http://wallet.skylab.vn/wallets/list', data, true)
}
