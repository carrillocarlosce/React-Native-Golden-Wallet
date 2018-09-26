import BigNumber from 'bignumber.js'
import caller from './api-caller'
import appState from '../AppStores/AppState'
import NetworkConfig from '../AppStores/stores/Config'
import URL from './url'

/**
 *
 * @param {String} address
 */
export const fetchWalletInfo = (address) => {
  if (!address) return Promise.reject()
  if (appState.networkName !== NetworkConfig.networks.mainnet) {
    const urlTest = URL.EtherScan.apiURL(appState.networkName)
    const apikey = 'SVUJNQSR2APDFX89JJ1VKQU4TKMB6W756M'
    const data = {
      module: 'account',
      action: 'balance',
      address,
      tag: 'latest',
      apikey
    }
    return new Promise((resolve, reject) => {
      caller.get(urlTest, data, true).then((res) => {
        const balance = res && res.data && res.data.result ? new BigNumber(`${res.data.result}e-18`) : new BigNumber('0')
        const result = {
          data: {
            data: {
              ETH: { balance: balance.toString(10) },
              address,
              tokens: []
            }
          }
        }
        resolve(result)
      }).catch(e => reject(e))
    })
  }
  const url = `${URL.Skylab.apiURL()}/balance/${address}`
  return caller.get(url, {}, true)
}

export const fetchWalletBTCInfo = (address) => {
  const url = `${URL.BlockChainInfo.apiURL()}/rawaddr/${address}`
  return caller.get(url, {}, true)
}

export const fetchRateETHDollar = () => {
  const data = {
    fsyms: 'ETH',
    tsyms: 'BTC,USD,EUR,GBP,AUD,CAD,CNY,JPY,RUB'
  }
  return caller.get(`${URL.CryptoCompare.apiURL()}/data/pricemultifull`, data, true)
}

export const fetchRateBTCDollar = () => {
  const data = {
    fsyms: 'BTC',
    tsyms: 'BTC,USD,EUR,GBP,AUD,CAD,CNY,JPY,RUB'
  }
  return caller.get(`${URL.CryptoCompare.apiURL()}/data/pricemultifull`, data, true)
}
