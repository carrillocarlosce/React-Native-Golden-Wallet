import { BigNumber } from 'bignumber.js'
import ApiCaller from './api-caller'

const processRequest = (methodName, params) => {
  const requestData = {
    method: methodName,
    params,
    id: 42,
    jsonrpc: '2.0'
  }

  return JSON.stringify(requestData)
}

const fetchJSON = (url, json) => new Promise((resolve, reject) => {
  const headers = {}
  let apiPromise = null
  if (json) {
    headers['Content-Type'] = 'application/json'
    apiPromise = ApiCaller.post(url, json, true, { 'Content-Type': 'application/json' })
  } else {
    apiPromise = ApiCaller.get(url, {})
  }

  return apiPromise.then((res) => {
    if (res.data.error) return reject(res.data.error)
    return resolve(res.data.result)
  })
})

const hexStripZeros = (value) => {
  let v = value
  while (v.length > 3 && v.substring(0, 3) === '0x0') {
    v = `0x${v.substring(3)}`
  }
  return v
}

const getTransaction = (transaction) => {
  const result = {}

  // Some nodes (INFURA ropsten INFURA mainnet is fine) don't like extra zeros.
  const fields = ['gasLimit', 'gasPrice', 'nonce', 'value']
  fields.forEach((k) => {
    if (!result[k]) { return }
    result[k] = hexStripZeros(result[k])
  })

  // Transform "gasLimit" to "gas"
  if (result.gasLimit !== null && result.gas === null) {
    result.gas = result.gasLimit
    delete result.gasLimit
  }

  return result
}

const checkBlockTag = (blockTag) => {
  if (blockTag == null) { return 'latest' }

  if (blockTag === 'earliest') { return '0x0' }

  if (blockTag === 'latest' || blockTag === 'pending') {
    return blockTag
  }

  if (typeof (blockTag) === 'number') {
    return `0x${new BigNumber(blockTag).toString(16)}`
  }

  throw new Error('invalid blockTag')
}

const call = (url = '', methodName, params) => {
  let requestData = {}

  switch (methodName) {
    case 'getBlockNumber':
      requestData = processRequest('eth_blockNumber', [])
      break

    case 'getGasPrice':
      requestData = processRequest('eth_gasPrice', [])
      break

    case 'getBalance':
      requestData = processRequest('eth_getBalance', [params.address.toLowerCase(), checkBlockTag(params.blockTag)])
      break

    case 'getTransactionCount':
      requestData = processRequest('eth_getTransactionCount', [params.address.toLowerCase(), checkBlockTag(params.blockTag)])
      break

    case 'getCode':
      requestData = processRequest('eth_getCode', [params.address.toLowerCase(), checkBlockTag(params.blockTag)])
      break

    case 'getStorageAt':
      requestData = processRequest('eth_getStorageAt', [params.address.toLowerCase(), params.position, checkBlockTag(params.blockTag)])
      break

    case 'sendTransaction':
      requestData = processRequest('eth_sendRawTransaction', [params.signedTransaction])
      break

    case 'getBlock':
      if (params.blockTag) {
        requestData = processRequest('eth_getBlockByNumber', [checkBlockTag(params.blockTag), false])
      } else if (params.blockHash) {
        requestData = processRequest('eth_getBlockByHash', [params.blockHash, false])
      }
      return Promise.reject(new Error('invalid block tag or block hash'))

    case 'getTransaction':
      requestData = processRequest('eth_getTransactionByHash', [params.transactionHash])
      break

    case 'getTransactionReceipt':
      requestData = processRequest('eth_getTransactionReceipt', [params.transactionHash])
      break

    case 'call':
      requestData = processRequest('eth_call', [getTransaction(params.transaction), 'latest'])
      break

    case 'estimateGas':
      requestData = processRequest('eth_estimateGas', [getTransaction(params.transaction)])
      break

    default:
      break
  }

  return fetchJSON(url, requestData)
}

export const getGasPrice = url => call(url, 'getGasPrice').then(v => new BigNumber(v, 16))
export const estimateGas = (url, transaction) => {
  const calculate = {}

  const fields = ['from', 'to', 'data', 'value']
  fields.forEach((key) => {
    if (transaction[key] == null) { return }
    calculate[key] = transaction[key]
  })

  return call(url, 'estimateGas', { transaction: calculate }).then(v => new BigNumber(v, 16))
}
export const getTransactionCount = (url, address, blockTag = 'pending') => {
  return call(url, 'getTransactionCount', { address, blockTag }).then(v => new BigNumber(v, 16))
}

export default {}
