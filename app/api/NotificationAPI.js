import DeviceInfo from 'react-native-device-info'
import ApiCaller from './api-caller'
import URL from './url'

export const addWallet = (name, address, deviceToken) => {
  const data = {
    name, address, device_token: deviceToken, device_udid: DeviceInfo.getUniqueID()
  }

  return ApiCaller.post(`${URL.Skylab.apiURL()}/wallets`, data, true)
}

export const removeWallet = (id) => {
  return ApiCaller.delete(`${URL.Skylab.apiURL()}/wallets/${id}`, {}, false)
}

export const addWallets = (wallets, deviceToken) => {
  const data = {
    wallets, device_token: deviceToken, device_udid: DeviceInfo.getUniqueID()
  }
  return ApiCaller.post(`${URL.Skylab.apiURL()}/wallets/list`, data, true)
}
