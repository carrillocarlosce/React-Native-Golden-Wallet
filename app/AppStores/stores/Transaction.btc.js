import { BigNumber } from 'bignumber.js'
import Transaction from './Transaction'
import MainStore from '../MainStore'
import constant from '../../commons/constant'

export default class TransactionBTC extends Transaction {
  walletType = 'bitcoin'

  constructor(obj, token = {}, status = 1) {
    super(obj, token, status)
    this.rate = MainStore.appState.rateBTCDollar
    this.timeStamp = obj.time
    this.hash = obj.hash
    this.from = obj.inputs.map(i => i.prev_out.addr)
    this.to = obj.out.map(o => o.addr)
    this.tokenName = 'bitcoin'
    this.tokenSymbol = 'BTC'
    this.decimal = 8
    this.gas = new BigNumber(`${obj.weight}`)
    this.gasPrice = new BigNumber(`1`)
    this.gasUsed = new BigNumber(`${obj.weight}`)
    this.status = 1
    this.value = new BigNumber(`${obj.out[0].value}`)
  }

  get isSelf() {
    const { selectedWallet } = MainStore.appState
    const address = this.address ? this.address : selectedWallet.address
    let self = true
    for (let i = 0; i < this.from.length; i++) {
      if (this.from[i] !== address) {
        self = false
        break
      }
    }
    if (self) {
      for (let i = 0; i < this.to.length; i++) {
        if (this.to[i] !== address) {
          self = false
          break
        }
      }
    }
    return self
  }

  get isSent() {
    const { selectedWallet } = MainStore.appState
    const address = this.address ? this.address : selectedWallet.address
    let sent = true
    for (let i = 0; i < this.from.length; i++) {
      if (this.from[i] !== address) {
        sent = false
        break
      }
    }
    return sent
  }

  get type() {
    if (this.isSelf) return constant.SELF
    if (this.status === 0) return constant.PENDING
    return this.isSent ? constant.SENT : constant.RECEIVED
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
