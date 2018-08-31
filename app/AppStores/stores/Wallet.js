import { observable, action, computed } from 'mobx'
import BigNumber from 'bignumber.js'
import WalletToken from './WalletToken'
import Keystore from '../../../Libs/react-native-golden-keystore'
import WalletDS from '../DataSource/WalletDS'
import api from '../../api'
import MainStore from '../MainStore'
import GetAddress, { chainNames } from '../../Utils/WalletAddresses'

// Object Wallet:
// title: 'I am cold wallet',
// address: '0xabc1232432bbfe',
// balance: '1000' (for caching),
// type: 'ethereum', (hiện tại chỉ hỗ trợ loại này)
// external: true, (true là import từ ngoài vào, false là do create)
// didBackup: true, (đã backup hay chưa)
// index: 0, (index trong mnemonic path, nếu là external thì -1)
// isCold: true, (yêu cầu nhập private key khi sign transaction)
// canSendTransaction: true,
// nonce: 1

const defaultObjWallet = {
  title: '',
  address: '',
  balance: '0',
  type: 'ethereum',
  path: Keystore.CoinType.ETH.path,
  external: false,
  didBackup: true,
  index: 0,
  isCold: false,
  canSendTransaction: true,
  nonce: 1
}

export default class Wallet {
  secureDS = null

  @observable title = ''
  @observable address = ''
  @observable balance = new BigNumber('0')
  @observable type = 'ethereum'
  path = Keystore.CoinType.ETH.path
  @observable external = false
  @observable didBackup = false
  @observable index = 0
  @observable isCold = false
  @observable canSendTransaction = true
  @observable nonce = 1
  @observable isFetchingBalance = false
  @observable totalBalance = new BigNumber('0')
  @observable isHideValue = false

  @observable tokens = []
  @observable transactions = []
  @observable isRefresh = false
  @observable importType = null

  walletCard = null

  static async generateNew(secureDS, title, index = 0, path = Keystore.CoinType.ETH.path) {
    if (!secureDS) throw new Error('Secure data source is required')
    const mnemonic = await secureDS.deriveMnemonic()
    const { private_key } = await Keystore.createHDKeyPair(mnemonic, '', path, index)
    const { address } = GetAddress(private_key, chainNames.ETH)
    secureDS.savePrivateKey(address, private_key)
    return new Wallet({
      address, balance: '0', index, title, isFetchingBalance: true
    }, secureDS)
  }

  static importPrivateKey(privateKey, title, secureDS) {
    const { address } = GetAddress(privateKey, chainNames.ETH)
    secureDS.savePrivateKey(address, privateKey)
    return new Wallet({
      address, balance: '0', index: -1, external: true, didBackup: true, importType: 'Private Key', isFetchingBalance: true, title
    }, secureDS)
  }

  static importAddress(address, title, secureDS) {
    return new Wallet({
      address, balance: '0', index: -1, external: true, didBackup: true, importType: 'Address', isFetchingBalance: true, title, canSendTransaction: false
    }, secureDS)
  }

  static async unlockFromMnemonic(mnemonic, title, index, secureDS) {
    const { private_key } = await Keystore.createHDKeyPair(mnemonic, '', Keystore.CoinType.ETH.path, index)
    const { address } = GetAddress(private_key, chainNames.ETH)
    secureDS.savePrivateKey(address, private_key)
    return new Wallet({
      address, balance: '0', index: -1, external: true, didBackup: true, importType: 'Mnemonic', isFetchingBalance: true, title
    }, secureDS)
  }

  static async getWalletAtAddress(address) {
    return await WalletDS.getWalletAtAddress(address)
  }

  static async getWalletsFromMnemonic(mnemonic, path = Keystore.CoinType.ETH.path, from = 0, to = 20) {
    const keys = await Keystore.createHDKeyPairs(mnemonic, '', path, from, to)
    const wallets = keys.map((k) => {
      const { address } = GetAddress(k.private_key, chainNames.ETH)
      return new Wallet({
        address, balance: '0', index: -1, external: true, didBackup: true, importType: 'Mnemonic', isFetchingBalance: true, title: ''
      })
    })

    return wallets
  }

  constructor(obj, secureDS) {
    this.secureDS = secureDS
    const initObj = Object.assign({}, defaultObjWallet, obj) // copy
    this._validateData(initObj)

    Object.keys(initObj).forEach((k) => {
      if (k === 'balance') initObj[k] = new BigNumber(initObj.balance)
      if (k === 'totalBalance') initObj[k] = new BigNumber(initObj.totalBalance)
      if (k === 'address') initObj[k] = initObj.address.toLowerCase()

      this[k] = initObj[k]
    })
  }

  setSecureDS(ds) {
    this.secureDS = ds
  }

  _validateData(obj) {
    if (!obj.address) throw new Error('Address is required')
  }

  // May get from local and decrypt or from mnemonic
  async derivePrivateKey() {
    if (!this.secureDS) throw new Error('Secure data source is required')
    if (!this.canSendTransaction) throw new Error('This wallet can not send transaction')
    if (this.external) return await this.secureDS.derivePrivateKey(this.address)

    const mnemonic = await this.secureDS.deriveMnemonic()
    const { private_key } = await Keystore.createHDKeyPair(mnemonic, '', this.path, this.index)
    return private_key
  }

  async update() {
    await WalletDS.updateWallet(this)
  }

  async save() {
    await WalletDS.addNewWallet(this)
  }

  async remove() {
    await WalletDS.deleteWallet(this.address)
  }

  getTokenAtAddress(address) {
    return this.tokens.find(t => t.address === address)
  }

  @action async implementPrivateKey(secureDS, privateKey) {
    this.canSendTransaction = true
    this.importType = 'Private Key'
    const { address } = GetAddress(privateKey, chainNames.ETH)
    if (address.toLowerCase() !== this.address.toLowerCase()) {
      throw new Error('Invalid Private Key')
    }
    secureDS.savePrivateKey(this.address, privateKey)
  }

  @action setWalletCard(card) {
    this.walletCard = card
  }

  @action offLoading() {
    this.isFetchingBalance = false
    this.isRefresh = false
    this.loading = false
  }

  @action async fetchingBalance(isRefresh = false, isBackground = false) {
    if (this.loading) return

    this.loading = true
    this.isRefresh = isRefresh
    this.isFetchingBalance = !isRefresh && !isBackground
    try {
      const res = await api.fetchWalletInfo(this.address)

      const { data } = res.data
      const tokens = data.tokens ? data.tokens.map(t => new WalletToken(t, this.address)) : []
      const tokenETH = this.getTokenETH(data)
      this.autoSetSelectedTokenIfNeeded([tokenETH, ...tokens])
      const totalTokenDollar = this.tokens.reduce((rs, item) => rs.plus(item.balanceInDollar), new BigNumber('0'))
      const totalTokenETH = totalTokenDollar.dividedBy(MainStore.appState.rateETHDollar)
      this.balance = new BigNumber(`${data.ETH.balance}`).times(new BigNumber('1e+18'))
      this.totalBalance = totalTokenETH
      this.update()
      this.offLoading()
    } catch (e) {
      this.offLoading()
    }
  }

  @action setTokens(tokens) {
    this.tokens = tokens
  }

  @action autoSetSelectedTokenIfNeeded(_tokens) {
    const tokens = _tokens
    const { selectedToken } = MainStore.appState
    const needSetSelectedToken = selectedToken && selectedToken.belongsToWalletAddress === this.address
    if (needSetSelectedToken) {
      for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].symbol === selectedToken.symbol) {
          selectedToken.balance = tokens[i].balance
          tokens[i] = selectedToken
        }
      }
    }

    this.setTokens(tokens)
  }

  @action setHideValue(isHide) {
    this.isHideValue = isHide
  }

  @computed get refreshing() {
    return this.isRefresh
  }

  @computed get balanceETH() {
    return this.balance
  }

  @computed get totalBalanceETH() {
    return this.totalBalance
  }

  @computed get totalBalanceDollar() {
    const rate = MainStore.appState.rateETHDollar
    return this.totalBalanceETH.multipliedBy(rate)
  }

  @computed get unspendTransactions() {
    return this.tokens.reduce((_rs, t) => {
      const rs = [..._rs, ...t.unspendTransactions.slice()]
      return rs
    }, [])
  }

  findToken(tokenAddress) {
    const token = this.tokens.find(t => t.address === tokenAddress)
    return token
  }

  getTokenETH(data) {
    const tokenETH = {
      tokenInfo: {
        address: data.address,
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
        price: {
          rate: MainStore.appState.rateETHDollar.toString(10)
        }
      },
      // balance: Starypto.Units.parseUnits(`${data.ETH.balance}`, 18)._bn.toString(10)
      balance: new BigNumber(data.ETH.balance).times(new BigNumber(1e+18)).toString(10)
    }

    return new WalletToken(tokenETH, this.address)
  }

  parseNumberToString(number) {
    const arrNum = number.split('.')
    const numberAfterDot = arrNum.length === 2 ? arrNum[1].length : 0
    if (numberAfterDot > 18) {
      return number.slice(0, 18 - numberAfterDot)
    }
    return number
  }

  toJSON() {
    const {
      title, address, balance, type,
      external, didBackup, index, isCold,
      canSendTransaction, nonce, isFetchingBalance,
      totalBalance, importType, isHideValue
    } = this
    return {
      title,
      address,
      balance: balance.toString(10),
      type,
      external,
      didBackup,
      index,
      isCold,
      canSendTransaction,
      nonce,
      isFetchingBalance,
      totalBalance: totalBalance.toString(10),
      importType,
      isHideValue
    }
  }
}
