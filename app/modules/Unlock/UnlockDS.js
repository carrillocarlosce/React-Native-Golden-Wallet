import { AsyncStorage } from 'react-native'

const dataKey = `DISABLED_TIME`

class UnlockDS {
  saveDisableData(disableData) {
    AsyncStorage.setItem(dataKey, JSON.stringify(disableData))
  }

  async getDisableData() {
    const disableData = await AsyncStorage.getItem(dataKey)
    return JSON.parse(disableData)
  }

  removeDisableData() {
    AsyncStorage.removeItem(dataKey)
  }
}

export default new UnlockDS()
