import caller from './api-caller'
import appState from '../AppStores/AppState'
import URL from './url'

/**
 *
 * @param {String} addressStr
 * @param {Object} data
 */
export const fetchTransactions = (addressStr, data, page = 1) => {
  const url = URL.EtherScan.apiURL(appState.networkName)
  const params = data
  params.page = page

  if (!addressStr) return Promise.reject()
  return caller.get(url, params, true)
}

/**
 *
 * @param {String} txHash
 */
export const checkStatusTransaction = (txHash) => {
  const url = URL.EtherScan.apiURL(appState.networkName)
  const apikey = 'SVUJNQSR2APDFX89JJ1VKQU4TKMB6W756M'
  const params = {
    module: 'transaction',
    action: 'gettxreceiptstatus',
    txHash,
    apikey
  }
  return caller.get(url, params, true)
}

export const fetchGasPrice = () => {
  return caller.get(`${URL.EthGasStation.apiURL()}/json/ethgasAPI.json`)
}

export const checkTxHasBeenDroppedOrFailed = (txHash) => {
  const url = `${URL.EtherScan.webURL(appState.networkName)}/tx/${txHash}`

  return caller.get(url)
    .then((res) => {
      if (res.data && typeof res.data === 'string') {
        const htmlString = res.data

        const removed = htmlString.includes('Dropped&Replaced') ||
          htmlString.includes('Dropped') ||
          htmlString.includes('Replaced') ||
          htmlString.includes('<font color="red">Fail</font>')

        const notBroadCast = htmlString.includes('we are unable to locate this Transaction Hash')
        if (notBroadCast) {
          return 'notBroadCast'
        }

        return removed
      }
      return true
    })
}

export const getTxID = (address) => {
  return caller.get(`${URL.BlockExplorer.apiURL()}/api/addr/${address}/utxo`)
}
