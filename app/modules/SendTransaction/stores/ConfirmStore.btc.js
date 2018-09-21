import { observable, action, computed } from 'mobx'
import { BigNumber } from 'bignumber.js'
import MainStore from '../../../AppStores/MainStore'
import Helper from '../../../commons/Helper'

export default class ConfirmStore {
  @observable value = new BigNumber('0')
  @observable gasLimit = new BigNumber('0')
  @observable gasPrice = new BigNumber('0')
  @observable adjust = 'Standard'
  @observable.ref inputValue = null
  @observable _fee = 0;

  @action setAdjust(value) {
    this.adjust = value
  }

  @action setValue(value) {
    this.inputValue = value
    this.value = value
  }

  @action updateValue(value) {
    this.value = value
  }

  @action setGasLimit(gasLimit) {
    this.gasLimit = new BigNumber(`${gasLimit}`)
  }

  @action setGasPrice(gasPrice) {
    const gasP = new BigNumber(gasPrice).times(new BigNumber(1e+9))
    this.gasPrice = gasP
  }

  @action setFee(fee) {
    this._fee = fee
  }

  @action estimateGas() {
  }

  @computed get rate() {
    return MainStore.appState.rateETHDollar
  }

  @computed get rateToken() {
    return MainStore.appState.selectedToken.rate
  }

  @computed get title() {
    return 'BTC'
  }

  @computed get fee() {
    return this.gasLimit.times(this.gasPrice).div(new BigNumber(1e+18))
  }

  @computed get formatedFee() {
    return `${this._fee} Satoshis`
  }

  @computed get formatedAmount() {
    Helper.formatETH()
    return `${Helper.formatETH(this.value, false, 4)} ${this.title}`
  }

  @computed get formatedDolar() {
    // TODO getRate
    const rate = MainStore.sendTransaction.isToken ? this.rateToken : this.rate
    const amountDolar = this.value.times(rate)
    return `$${Helper.formatUSD(amountDolar, false, 1000000, 2)}`
  }
  _onShowAdvance() {
    const formatedGasPrice = this.gasPrice.div(1e+9).toFixed(0)

    MainStore.sendTransaction.advanceStore.setGasLimit(this.gasLimit.toString(10))
    MainStore.sendTransaction.advanceStore.setGasPrice(formatedGasPrice)
  }
  @action validateAmount() {
  }
}
