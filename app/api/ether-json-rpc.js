import { BigNumber } from 'bignumber.js'
import { ec as Ec } from 'elliptic'
import ApiCaller from './api-caller'
import utils from '../Utils/Ethererum'

const secp256k1 = new Ec('secp256k1')

const defaultGasLimit = 1500000

const transactionFields = [
  { name: 'nonce', maxLength: 32 },
  { name: 'gasPrice', maxLength: 32 },
  { name: 'gasLimit', maxLength: 32 },
  { name: 'to', length: 20 },
  { name: 'value', maxLength: 32 },
  { name: 'data' }
]

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

export const sendTransaction = (url, transaction, fromAddress, chainId, privateKey) => {
  if (!transaction || typeof (transaction) !== 'object') {
    throw new Error('invalid transaction object')
  }

  const gasLimit = transaction.gasLimit || defaultGasLimit
  const gasPricePromise = transaction.gasPrice ? Promise.resolve(transaction.gasPrice) : getGasPrice(url)
  const noncePromise = transaction.nonce
    ? Promise.resolve(transaction.nonce)
    : getTransactionCount(url, fromAddress).then(v => Number(v.toString(10)))
  const data = utils.hexlify(transaction.data || '0x')
  const value = utils.hexlify(transaction.value || 0)

  return Promise.all([gasPricePromise, noncePromise]).then((results) => {

    const signedTransaction = signTransaction({
      to: transaction.to,
      data,
      gasLimit,
      gasPrice: results[0],
      nonce: results[1],
      value,
      chainId
    }, chainId, privateKey)

    return call(url, 'sendTransaction', { signedTransaction: utils.hexlify(signedTransaction) })
  })
}

export const signDigest = (digest, privateKey) => {
  if (!privateKey) throw new Error('Private key not found')
  const keyPair = secp256k1.keyFromPrivate(privateKey)
  const signature = keyPair.sign(utils.arrayify(digest), { canonical: true })
  return {
    recoveryParam: signature.recoveryParam,
    r: `0x${signature.r.toString(16)}`,
    s: `0x${signature.s.toString(16)}`
  }
}

export const signTransaction = (transaction, chainId, privateKey) => {
  const raw = []
  transactionFields.forEach((fieldInfo) => {
    let value = transaction[fieldInfo.name] || ([])
    value = utils.arrayify(utils.hexlify(value), fieldInfo.name)

    // Fixed-width field
    if (fieldInfo.length && value.length !== fieldInfo.length && value.length > 0) {
      const error = new Error(`invalid ${fieldInfo.name}`)
      error.reason = 'wrong length'
      error.value = value
      throw error
    }

    // Variable-width (with a maximum)
    if (fieldInfo.maxLength) {
      value = utils.stripZeros(value)
      if (value.length > fieldInfo.maxLength) {
        const error = new Error(`invalid ${fieldInfo.name}`)
        error.reason = 'too long'
        error.value = value
        throw error
      }
    }

    raw.push(utils.hexlify(value))
  })

  if (chainId) {
    raw.push(utils.hexlify(chainId))
    raw.push('0x')
    raw.push('0x')
  }

  const digest = utils.keccak256(utils.RLP.encode(raw))
  const signature = signDigest(digest, privateKey)

  let v = 27 + signature.recoveryParam
  if (chainId) {
    raw.pop()
    raw.pop()
    raw.pop()
    v += chainId * 2 + 8
  }

  raw.push(utils.hexlify(v))
  raw.push(signature.r)
  raw.push(signature.s)

  return utils.RLP.encode(raw)
}
