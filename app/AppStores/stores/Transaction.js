import { BigNumber } from 'bignumber.js'
import constant from '../../commons/constant'
import Helper from '../../commons/Helper'
import MainStore from '../MainStore'
import api from '../../api'

const defaultData = {
  blockNumber: '0',
  timeStamp: '0', // required
  hash: '', // required
  nonce: '0',
  blockHash: '0x00',
  from: '0x00', // required
  contractAddress: '0x00', // required
  to: '0x00', // required
  value: '0', // required
  tokenName: '', // required
  tokenSymbol: '', // required
  tokenDecimal: '', // required
  transactionIndex: '0',
  gas: '0', // required
  gasPrice: '0', // required
  gasUsed: '0',
  cumulativeGasUsed: '0',
  input: '0x00',
  confirmations: '97923',
  isSelf: false,
  status: 1 // not in API (0:pending | 1:success | 2:not_send)
}

export default class Transaction {
  rate = new BigNumber(0)
  walletType = 'ethereum'

  static generateUnspendTransaction(obj, token) {
    const transaction = { ...obj, status: 0 }
    return new Transaction(transaction, token, 0)
  }

  constructor(obj, token, status = 1) {
    if (token) this.rate = token.rate

    const initObj = Object.assign({}, defaultData, obj)

    this.status = status
    Object.keys(initObj).forEach((k) => {
      switch (k) {
        case 'value':
        case 'gas':
        case 'gasPrice':
        case 'gasUsed':
        case 'rate':
          this[k] = new BigNumber(`${initObj[k]}`)
          break
        case 'tokenDecimal':
          this[k] = initObj[k] !== '' ? initObj[k] : 18
          break
        default:
          this[k] = initObj[k]
          break
      }
    })
  }

  save(key) {
    // call ds
  }

  get isETH() {
    return this.tokenSymbol.toLowerCase() === 'eth'
  }

  get isSent() {
    const { selectedWallet } = MainStore.appState
    const address = this.address ? this.address : selectedWallet.address
    return this.from.toLocaleLowerCase() === address.toLocaleLowerCase()
  }

  get type() {
    if (this.isSelf) return constant.SELF
    if (this.status === 0) return constant.PENDING
    return this.isSent ? constant.SENT : constant.RECEIVED
  }

  get decimal() {
    return this.isETH ? 18 : this.tokenDecimal
  }

  get fee() {
    if (this.status === 1) {
      return this.gasUsed.multipliedBy(this.gasPrice).dividedBy(new BigNumber(`1.0e+18`))
    }
    return this.gas.multipliedBy(this.gasPrice).dividedBy(new BigNumber(`1.0e+18`))
  }

  get feeFormat() {
    const feeStr = this.fee.toFixed(4)
    const usd = this.fee.times(MainStore.appState.rateETHDollar).toFixed(2)
    let usdStr = `= $${usd}`
    if (usd === '0') {
      usdStr = ''
    }
    return `${feeStr} ETH ${usdStr}`
  }

  get balance() {
    return this.value.dividedBy(new BigNumber(`1.0e+${this.decimal}`))
  }

  get balanceUSD() {
    return this.balance.multipliedBy(this.rate)
  }

  get date() {
    return Helper.formatTransactionDate(this.timeStamp)
  }

  // Return true if it's status is success and removed from local storage
  async fetchToCheckHasSuccess() {
    try {
      const apiResponse = await api.checkStatusTransaction(this.hash)
      return apiResponse.data.result.status === '1'
    } catch (_) {
      // do nothing
      return false
    }
  }

  async fetchToCheckDroppedOrReplaced() {
    try {
      const result = await api.checkTxHasBeenDroppedOrFailed(this.hash)
      if (result === 'notBroadCast') {
        // const oneHour = 60 * 60 * 1000
        // const hoursFromCreated = (new Date().getTime() - (this.timeStamp * 1000)) / oneHour

        const minsFromCreated = (new Date().getTime() - (this.timeStamp * 1000)) / (60 * 1000)
        return minsFromCreated > 5
      }
      return result
    } catch (_) {
      // do nothing
      return false
    }
  }

  // For unspend transation
  async canRemove() {
    return Promise.all([
      this.fetchToCheckDroppedOrReplaced(),
      this.fetchToCheckHasSuccess()
    ])
      .then(([replacedOrDropped, isSuccess]) => replacedOrDropped || isSuccess)
  }

  toJSON() {
    const {
      blockNumber, timeStamp, hash, nonce,
      blockHash, from, contractAddress, to, value,
      tokenName, tokenSymbol, tokenDecimal, transactionIndex, rate,
      gas, gasPrice, gasUsed, cumulativeGasUsed, input, confirmations, status
    } = this

    return {
      blockNumber,
      timeStamp,
      hash,
      nonce,
      blockHash,
      from,
      contractAddress,
      to,
      value: value.toString(10),
      tokenName,
      tokenSymbol,
      tokenDecimal,
      transactionIndex,
      gas: gas.toString(10),
      gasPrice: gasPrice.toString(10),
      gasUsed: gasUsed.toString(10),
      cumulativeGasUsed,
      input,
      confirmations,
      status,
      rate: rate.toString(10)
    }
  }
}
