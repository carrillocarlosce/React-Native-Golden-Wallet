import { observable, action, computed } from 'mobx'
import BigNumber from 'bignumber.js'
import Wallet from './Wallet'
import Keystore from '../../../../Libs/react-native-golden-keystore'
import api from '../../../api'
import MainStore from '../../MainStore'
import WalletTokenBTC from '../WalletToken.btc'
import TransactionBTC from '../Transaction.btc'
import GetAddress, { chainNames } from '../../../Utils/WalletAddresses'

const defaultObjWallet = {
  title: '',
  address: '',
  balance: '0',
  type: 'bitcoin',
  path: Keystore.CoinType.BTC.path,
  external: false,
  didBackup: true,
  index: 0,
  isCold: false,
  canSendTransaction: true,
  nonce: 1
}
export default class WalletBTC extends Wallet {
  path = Keystore.CoinType.BTC.path
  type = 'bitcoin'
  @observable isFetchingBalance = false
  @observable totalBalance = new BigNumber('0')
  @observable isHideValue = false
  @observable enableNotification = true
  @observable isRefresh = false

  constructor(obj, secureDS) {
    super(obj, secureDS)
    this.secureDS = secureDS
    const initObj = Object.assign({}, defaultObjWallet, obj) // copy
    this._validateData(initObj)

    Object.keys(initObj).forEach((k) => {
      if (k === 'balance') initObj[k] = new BigNumber(initObj.balance)
      if (k === 'totalBalance') initObj[k] = new BigNumber(initObj.totalBalance)
      if (k === 'address') initObj[k] = initObj.address

      this[k] = initObj[k]
    })
    this.tokens = [this.getTokenBTC()]
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
      const res = await api.fetchWalletBTCInfo(this.address)
      if (res.status !== 200) {
        this.balance = new BigNumber(`0`)
        this.totalBalance = this.balance
      } else if (res.data) {
        this.balance = new BigNumber(`${res.data.final_balance}`)
        this.totalBalance = this.balance.times(new BigNumber('1e-8'))
      } else {
        this.balance = new BigNumber(`0`)
        this.totalBalance = this.balance
      }
      this.tokens = [this.getTokenBTC()]
      this.tokens[0].transactions = res.data.txs.map(tx => new TransactionBTC(tx, this.tokens[0], 1))
      this.update()
      this.offLoading()
    } catch (e) {
      this.offLoading()
    }
  }

  @action async implementPrivateKey(secureDS, privateKey, coin = chainNames.BTC) {
    this.canSendTransaction = true
    this.importType = 'Private Key'
    const { address } = GetAddress(privateKey, coin)
    if (coin === chainNames.BTC && address !== this.address) {
      throw new Error('Invalid Private Key')
    }
    secureDS.savePrivateKey(this.address, privateKey)
  }

  @computed get totalBalanceDollar() {
    const rate = MainStore.appState.rateBTCDollar
    return this.totalBalanceETH.multipliedBy(rate)
  }

  getTokenBTC() {
    const tokenETH = {
      tokenInfo: {
        address: this.address,
        name: 'Bitcoin',
        symbol: 'BTC',
        decimals: 8,
        price: {
          rate: MainStore.appState.rateBTCDollar.toString(10)
        }
      },
      balance: this.balance.toString(10)
    }

    return new WalletTokenBTC(tokenETH, this.address)
  }
}
