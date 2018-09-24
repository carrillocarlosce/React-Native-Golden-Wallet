import DeviceInfo from 'react-native-device-info'
import ApiCaller from './api-caller'
import URL from './url'

export const addWallet = (name, address, deviceToken, type) => {
  const device_udid = DeviceInfo.getUniqueID() !== '' ? DeviceInfo.getUniqueID() : deviceToken.substring(0, 10)
  const data = {
    name, address, device_token: deviceToken, device_udid, type
  }

  return ApiCaller.post(`${URL.Skylab.apiURL()}/wallets`, data, true)
}

export const removeWallet = (id) => {
  return ApiCaller.delete(`${URL.Skylab.apiURL()}/wallets/${id}`, {}, false)
}

export const addWallets = (wallets, deviceToken) => {
  const device_udid = DeviceInfo.getUniqueID() !== '' ? DeviceInfo.getUniqueID() : deviceToken.substring(0, 10)
  const data = {
    wallets, device_token: deviceToken, device_udid
  }
  return ApiCaller.post(`${URL.Skylab.apiURL()}/wallets/list`, data, true)
}

export const initNotification = (wallets = [], deviceToken) => {
  const device_udid = DeviceInfo.getUniqueID() !== '' ? DeviceInfo.getUniqueID() : deviceToken.substring(0, 10)
  const data = {
    wallets, device_token: deviceToken, device_udid, status: 1
  }
  return ApiCaller.post(`${URL.Skylab.apiURL()}/wallets/list`, data, true)
}

export const offNotification = (deviceToken) => {
  const device_udid = DeviceInfo.getUniqueID() !== '' ? DeviceInfo.getUniqueID() : deviceToken.substring(0, 10)
  return ApiCaller.put(`${URL.Skylab.apiURL()}/wallets/${device_udid}/disable`)
}

export const onNotification = (deviceToken) => {
  const device_udid = DeviceInfo.getUniqueID() !== '' ? DeviceInfo.getUniqueID() : deviceToken.substring(0, 10)
  return ApiCaller.put(`${URL.Skylab.apiURL()}/wallets/${device_udid}/enable`)
}
