import { BigNumber } from 'bignumber.js'
import Transaction from './Transaction'
import MainStore from '../MainStore'

export default class TransactionBTC extends Transaction {
  constructor(obj, token, status = 1) {
    super(obj, token, status)
    if (token) this.rate = token.rate
    this.timeStamp = obj.time
    this.hash = obj.hash
    this.from = obj.inputs[0].prev_out.addr
    this.to = obj.out[0].addr
    this.tokenName = 'bitcoin'
    this.tokenSymbol = 'BTC'
    this.decimal = 8
    this.gas = new BigNumber(`${obj.weight}`)
    this.gasPrice = new BigNumber(`1`)
    this.gasUsed = new BigNumber(`${obj.weight}`)
    this.status = 1
    this.value = new BigNumber(`${obj.out[0].value}`)
  }

  get fee() {
    if (this.status === 1) {
      return this.gasUsed.multipliedBy(this.gasPrice).dividedBy(new BigNumber(`1.0e+8`))
    }
    return this.gas.multipliedBy(this.gasPrice).dividedBy(new BigNumber(`1.0e+8`))
  }

  get feeFormat() {
    const usd = this.fee.times(MainStore.appState.rateBTCDollar).toFixed(2)
    let usdStr = `= $${usd}`
    if (usd === '0') {
      usdStr = ''
    }
    return `${this.gasUsed} Satoshi ${usdStr}`
  }

  get balance() {
    return this.value.dividedBy(new BigNumber(`1.0e+8`))
  }

  get balanceUSD() {
    return this.balance.multipliedBy(this.rate)
  }
}
