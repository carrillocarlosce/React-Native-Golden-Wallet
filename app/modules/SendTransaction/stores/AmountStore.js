import { observable, action, computed, toJS } from 'mobx'
import { BigNumber } from 'bignumber.js'
import HapticHandler from '../../../Handler/HapticHandler'
import Helper from '../../../commons/Helper'
import MainStore from '../../../AppStores/MainStore'

class AmountStore {
  @observable amountText = {
    data: [],
    subData: [],
    isUSD: false,
    isHadPoint: false
  }

  prefix = '$'
  selectedCoinModal = ''

  @computed get amountCrypto() {
    const { selectedWallet, selectedToken } = MainStore.appState
    if (selectedWallet.type === 'bitcoin') return (selectedWallet.balance.dividedBy(new BigNumber('1.0e+8')))
    return MainStore.sendTransaction.isToken
      ? (selectedToken.balance.dividedBy(new BigNumber(`1.0e+${selectedToken.decimals}`)))
      : (selectedWallet.balance.dividedBy(new BigNumber('1.0e+18'))) // Big Num
  }

  @computed get rate() {
    const { selectedToken } = MainStore.appState
    const { selectedWallet } = MainStore.appState
    return selectedWallet.type === 'ethereum'
      ? MainStore.sendTransaction.isToken ? selectedToken.rate : MainStore.appState.rateETHDollar
      : MainStore.appState.rateBTCDollar // Big Num
  }

  @computed get postfix() {
    const { selectedToken } = MainStore.appState
    const { selectedWallet } = MainStore.appState

    return selectedWallet.type === 'ethereum'
      ? MainStore.sendTransaction.isToken ? selectedToken.symbol
        : 'ETH' : 'BTC' // String
  }

  @computed get walletName() {
    const { selectedWallet } = MainStore.appState
    return selectedWallet.title // String
  }

  @computed get amountUSD() {
    const { selectedWallet, selectedToken } = MainStore.appState
    return selectedWallet.type === 'ethereum'
      ? MainStore.sendTransaction.isToken ? selectedToken.balanceInDollar : selectedWallet.totalBalanceDollar
      : selectedWallet.totalBalanceDollar // Big num
  }

  @computed get amountTextBigNum() {
    return new BigNumber(this.amountTextString) // Big num
  }

  @computed get amountSubTextBigNum() {
    const { isUSD } = this.amountText
    return isUSD
      ? (this.rate.isZero() ? new BigNumber(0) : this.amountTextBigNum.dividedBy(this.rate))
      : this.amountTextBigNum.multipliedBy(this.rate)
  }

  @computed get valueBigNum() {
    const { isUSD } = this.amountText
    return isUSD ? this.amountSubTextBigNum : this.amountTextBigNum
  }

  @computed get fee() {
    const { selectedWallet } = MainStore.appState
    const gasLimt = MainStore.sendTransaction.isToken ? new BigNumber(150000) : new BigNumber(21000)
    const gasPriceStandard = new BigNumber(`${MainStore.appState.gasPriceEstimate.standard}e+9`)
    const fee = gasLimt.times(gasPriceStandard).div(new BigNumber(1e+18))
    const { isUSD } = this.amountText
    if (MainStore.sendTransaction.isToken) {
      return 0
    }
    return selectedWallet.type === 'ethereum'
      ? isUSD ? fee.times(this.rate) : fee
      : new BigNumber('400e-8')
  }

  @computed get amountTextString() {
    const array = this.amountText.data.map((item) => { return item.text })
    return array.join('').replace(/,/g, '') || '0' // String
  }

  @computed get amountCryptoString() {
    return this.amountCrypto.toString(10) // String
  }

  @computed get amountUSDString() {
    return this.amountUSD.toString(10) // String
  }

  @computed get amountHeaderString() {
    const { isUSD } = this.amountText
    let eth = Helper.formatUSD((this.amountUSD.minus(this.amountTextBigNum).toString(10)), true)
    let usd = Helper.formatETH((this.amountCrypto.minus(this.amountTextBigNum).toString(10)), true)
    if (eth.charAt(0) === '-') {
      eth = '0'
    }
    if (usd.charAt(0) === '-') {
      usd = '0'
    }
    return isUSD
      ? `${this.prefix}${eth}`
      : `${usd} ${this.postfix}`
  }

  @computed get amountHeaderAddressInputScreen() {
    const { isUSD } = this.amountText
    return isUSD
      ? `${this.prefix}${Helper.formatUSD(this.amountTextString, true)}`
      : `${Helper.formatETH(this.amountTextString, true)} ${this.postfix}`
  }

  @computed get amountSubTextString() {
    const { isUSD } = this.amountText
    return isUSD
      ? `${Helper.formatETH(this.amountSubTextBigNum.toString(10), true)} ${this.postfix}`
      : `${this.prefix}${Helper.formatUSD(this.amountSubTextBigNum.toString(10), true)}`
  }

  @computed get checkButtonEnable() {
    return this.amountText.data.length != 0 && this.checkValueValid
  }

  @computed get checkWarningTitle() {
    if (this.amountText.data.length == 0) return false
    return !this.checkValueValid
  }

  @computed get checkMaxBalanceWithFee() {
    return this.amountText.isUSD
      ? Helper.formatUSD(this.amountTextString.toString(10), true, 1000000) === Helper.formatUSD(this.amountUSD.minus(this.fee).toString(10), true, 1000000)
      : Helper.formatETH(this.amountTextString.toString(10), true) === Helper.formatETH(this.amountCrypto.minus(this.fee).toString(10), true)
  }

  @computed get checkSmallSize() {
    const {
      data,
      isUSD,
      isHadPoint,
      subData
    } = this.amountText
    const newSubData = subData.map((item) => { return item.text != '' })
    return isUSD
      ? (isHadPoint ? data.length + newSubData.length > 9 : data.length > 9)
      : (isHadPoint ? data.length + newSubData.length > 6 : data.length > 6)
  }

  @computed get checkValueValid() {
    return (this.amountText.isUSD
      ? this.amountTextBigNum.isLessThanOrEqualTo(this.amountUSD.minus(this.fee))
      : this.amountTextBigNum.isLessThanOrEqualTo(this.amountCrypto.minus(this.fee)))
  }

  @computed get getAmountText() {
    return toJS(this.amountText) // object
  }

  @action setSelectedCoinModal(ref) {
    this.selectedCoinModal = ref
  }

  @action toggle() {
    this.amountText = {
      data: [],
      subData: [],
      isUSD: !this.amountText.isUSD,
      isHadPoint: false
    }
    HapticHandler.ImpactLight()
  }

  @action setAmountText(object) {
    this.amountText = {
      ...this.amountText,
      ...object
    }
  }

  @action send() {
    MainStore.sendTransaction.confirmStore.setValue(this.valueBigNum)
  }

  @action max() {
    const { isUSD } = this.amountText
    const value = isUSD
      ? ((this.amountUSD.minus(this.fee)).lt(new BigNumber('0')) ? new BigNumber('0') : this.amountUSD.minus(this.fee))
      : ((this.amountCrypto.minus(this.fee)).lt(new BigNumber('0')) ? new BigNumber('0') : this.amountCrypto.minus(this.fee))
    const valueString = isUSD
      ? Helper.formatUSD(value.toString(10), true, 100000000)
      : Helper.formatETH(value.toString(10), true)
    const dataSplit = valueString.toString().split('.')
    const integer = dataSplit[0]
    const decimal = dataSplit[1] ? dataSplit[1] : ''
    if (decimal.split('').length == 0) {
      const data = Helper.numberWithCommas(integer).split('').map((item) => { return { text: item } })
      this.setAmountText({ data, subData: [], isHadPoint: false })
    } else if (decimal.split('').length == 1) {
      const string = `${Helper.numberWithCommas(integer)}.${decimal}`
      const data = string.split('').map((item) => { return { text: item } })
      const subData = isUSD ? [{ text: '0' }] : [{ text: '0' }, { text: '' }, { text: '' }, { text: '' }]
      this.setAmountText({ data, subData, isHadPoint: true })
    } else if (decimal.split('').length == 2) {
      const string = `${Helper.numberWithCommas(integer)}.${decimal}`
      const data = string.split('').map((item) => { return { text: item } })
      const subData = isUSD ? [] : [{ text: '0' }, { text: '' }, { text: '' }]
      this.setAmountText({ data, subData, isHadPoint: true })
    } else if (decimal.split('').length == 3) {
      const string = `${Helper.numberWithCommas(integer)}.${decimal}`
      const data = string.split('').map((item) => { return { text: item } })
      const subData = [{ text: '0' }, { text: '' }]
      this.setAmountText({ data, subData, isHadPoint: true })
    } else if (decimal.split('').length == 4) {
      const string = `${Helper.numberWithCommas(integer)}.${decimal}`
      const data = string.split('').map((item) => { return { text: item } })
      const subData = [{ text: '0' }]
      this.setAmountText({ data, subData, isHadPoint: true })
    }
    HapticHandler.ImpactLight()
  }

  @action add(item) {
    const {
      data,
      subData,
      isUSD,
      isHadPoint
    } = this.amountText
    if (data.length == (isUSD ? 9 : 6) && item.text !== '.' && !isHadPoint) return
    else if (data.length == 0 && item.text == '.') {
      const newData = [{ text: '0' }, item]
      const newSubData = isUSD ? [{ text: '0' }, { text: '' }] : [{ text: '0' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }]
      this.setAmountText({ data: newData, subData: newSubData, isHadPoint: true })
      return
    } else if (data.length == 1 && item.text !== '.' && data[0].text == '0') {
      data.pop()
      data.push(item)
      this.setAmountText({ data, isHadPoint: false })
      return
    } else if (isHadPoint && item.text === '.') return
    else if (subData.length > 0) {
      data.push(item)
      subData.pop()
      this.setAmountText({ subData, data })
      return
    } else if (subData.length == 0 && isHadPoint) return
    const zeroAfterPoint = item.text === '.' ? (isUSD ? [{ text: '0' }, { text: '' }] : [{ text: '0' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }]) : []
    if (data.length == 3 && item.text !== '.') data.splice(1, 0, { text: ',' })
    else if (data.length == 5 && item.text !== '.') {
      data.splice(1, 1)
      data.splice(2, 0, { text: ',' })
    } else if (data.length == 6 && item.text !== '.') {
      data.splice(2, 1)
      data.splice(3, 0, { text: ',' })
    } else if (data.length == 7 && item.text !== '.') {
      data.splice(3, 1)
      data.splice(1, 0, { text: ',' })
      data.splice(5, 0, { text: ',' })
    }
    this.setAmountText({ data: [...data, item], subData: zeroAfterPoint, isHadPoint: item.text === '.' ? true : isHadPoint })
  }

  @action clearAll() {
    this.setAmountText({ data: [], subData: [], isHadPoint: false })
  }

  @action remove() {
    const {
      data,
      subData,
      isUSD,
      isHadPoint
    } = this.amountText
    if (subData.length == (isUSD ? 2 : 5)) {
      data.pop()
      this.setAmountText({ data, subData: [], isHadPoint: false })
      return
    } else if (subData.length > 0) {
      data.pop()
      subData.push({ text: '' })
      this.setAmountText({ subData, data })
      return
    } else if (subData.length == 0 && isHadPoint) {
      const item = data.pop()
      subData.push({ text: '0' })
      this.setAmountText({ data, subData, isHadPoint: item.text === '.' ? false : isHadPoint })
      return
    } else if (data.length == 0) return
    const item = data.pop()
    if (data.length == 4) data.splice(1, 1)
    else if (data.length == 5) {
      data.splice(2, 1)
      data.splice(1, 0, { text: ',' })
    } else if (data.length == 6) {
      data.splice(3, 1)
      data.splice(2, 0, { text: ',' })
    } else if (data.length == 8) {
      data.splice(1, 1)
      data.splice(4, 1)
      data.splice(3, 0, { text: ',' })
    } else if (data.length == 9) {
      data.splice(2, 1)
      data.splice(5, 1)
      data.splice(1, 0, { text: ',' })
      data.splice(5, 0, { text: ',' })
    } else if (data.length == 10) {
      data.splice(3, 1)
      data.splice(6, 1)
      data.splice(2, 0, { text: ',' })
      data.splice(5, 0, { text: ',' })
    } else if (data.lenth == 12) {
      data.splice(1, 1)
      data.splice(4, 1)
      data.splice(7, 1)
      data.splice(3, 0, { text: ',' })
      data.splice(7, 0, { text: ',' })
    }
    // dataRef[`${data.length}`] && dataRef[`${data.length}`].removeAnimation()
    this.setAmountText({ data, isHadPoint: item.text === '.' ? false : isHadPoint })
  }
}

export default AmountStore
