import { observable, action, computed } from 'mobx'
import BigNumber from 'bignumber.js'
import MainStore from '../../../AppStores/MainStore'
import Helper from '../../../commons/Helper'

export default class AdvanceStore {
  @observable gasLimit = ''
  @observable gasPrice = ''
  @observable isShowClearGasLimit = false
  @observable isShowClearGasPrice = false
  @observable gasLimitErr = ''
  @observable gasGweiErr = ''
  @observable isDisableDone = false

  @action setGasLimit(gasLimit) {
    // if (!gasLimit) return this.gasLimit = ''
    this.gasLimit = gasLimit.replace(/\D/g, '')
  }
  @action setGasPrice(gasPrice) {
    // if (!gasPrice) return this.gasPrice = '1'
    this.gasPrice = gasPrice.replace(/\D/g, '')
  }
  @action setGasLimitErr(err) {
    this.gasLimitErr = err
  }
  @action setGasPriceErr(err) {
    this.gasGweiErr = err
  }
  @action setDisableDone(bool) {
    this.isDisableDone = bool
  }
  @action validate() {

  }

  @action setShowClearGasLimit(value) {
    this.isShowClearGasLimit = value
  }

  @action reset() {
    this.gasGweiErr = ''
    this.gasLimitErr = ''
  }

  @computed get validateGas() {
    if (this.gasGweiErr == '' && this.gasLimitErr == '') {
      return true
    }
    return false
  }

  @computed get rate() {
    return MainStore.appState.rateETHDollar
  }

  @computed get title() {
    return 'ETH'
  }

  _onDone() {
    MainStore.sendTransaction.confirmStore.setGasLimit(this.gasLimit)
    MainStore.sendTransaction.confirmStore.setGasPrice(this.gasPrice)
    MainStore.sendTransaction.confirmStore.validateAmount()
  }

  @computed get formatedTmpFee() {
    const price = this.gasPrice !== '' ? this.gasPrice : 0
    const gas = this.gasLimit !== '' ? this.gasLimit : 0
    const gasLimit = new BigNumber(gas).div(1e+9)
    const gasPrice = new BigNumber(price)
    const fee = gasLimit.times(gasPrice)
    const feeUSD = fee.times(this.rate)
    const usd = Helper.formatUSD(feeUSD) !== '0'
      ? `($${Helper.formatUSD(feeUSD)})`
      : ''
    return `${Helper.formatETH(fee.toString(10), false, 6)} ${this.title} ${usd}`
  }
}
