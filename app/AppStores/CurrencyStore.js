import { observable, action, computed } from 'mobx'
import { AsyncStorage } from 'react-native'
import API from '../api'

class ObservableCurrencyStore {
  @observable currencyETH = null

  saveCurrency(currencyData) {
    const jsonString = JSON.stringify(currencyData)
    return AsyncStorage.setItem('CURRENCY_DATA', jsonString)
  }

  @action getCurrency() {
    if (!this.currencyETH) {
      this.getCurrencyAPI()
    }
    return AsyncStorage.getItem('CURRENCY_DATA').then((currencyData) => {
      if (!currencyData) {
        return null
      }
      const currency = JSON.parse(currencyData)
      this.currencyETH = currency
      this.getCurrencyAPI()
      return this.currencyETH
    })
  }

  @action getCurrencyAPI() {
    return API.fetchRateETHDollar().then((res) => {
      this.currencyETH = res.data.RAW.ETH
      this.saveCurrency(this.currencyETH)
      return this.currencyETH
    })
  }

  @computed get currencyUSD() {
    return this.currencyETH ? this.currencyETH.USD.PRICE : 0
  }
}

const CurrencyStore = new ObservableCurrencyStore()
export default CurrencyStore
