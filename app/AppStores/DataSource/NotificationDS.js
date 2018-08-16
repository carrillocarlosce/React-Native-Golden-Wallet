import { AsyncStorage } from 'react-native'

const dataKey = (address) => `${address}-notification`.toLowerCase()

class NotificationDS {
  saveNotifID(address, id) {
    AsyncStorage.setItem(dataKey(address), id)
  }

  async getNotifID(address) {
    return await AsyncStorage.getItem(dataKey(address))
  }
}

export default new NotificationDS()
