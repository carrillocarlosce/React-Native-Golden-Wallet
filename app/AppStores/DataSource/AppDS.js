import { AsyncStorage } from 'react-native'
import AppState from '../AppState'

const dataKey = 'APP_STORAGE'

// {
//   dataVersion: 1,
//   config: { network: 'mainnet', ...},
//   defaultWallet: {...},
//   selectedWallet: {...},
//   selectedToken: {...},
//   wallets: [{...},{...},...],
//   addressBooks: [{...},{...},...]
// }

// Store all configs app data
class AppDataSource {
  async readAppData() {
    const dataString = await AsyncStorage.getItem(dataKey)
    if (!dataString) return AppState
    const data = JSON.parse(dataString)
    await AppState.import(data)
    return AppState
  }

  async saveAppData(data) {
    return AsyncStorage.setItem(dataKey, JSON.stringify(data))
  }

  async enraseData() {
    return new Promise(async (resolve, reject) => {
      const allKeys = await AsyncStorage.getAllKeys()
      const removePromises = allKeys.map(k => AsyncStorage.removeItem(k))
      Promise.all(removePromises)
        .then(res => resolve(res))
        .catch(e => reject(e))
    })
  }
}

export default new AppDataSource()
