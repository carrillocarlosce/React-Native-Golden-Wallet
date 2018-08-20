import { observable, action, computed } from 'mobx'
import { BigNumber } from 'bignumber.js'
import appState from '../AppState'
import API from '../../api'
import Transaction from './Transaction'
import UnspendTransactionDS from '../DataSource/UnspendTransactionDS'

export default class WalletToken {
  @observable title = ''
  @observable address = ''
  @observable decimals = 1
  @observable symbol = ''
  @observable rate = 10
  @observable balance = 1

  @observable transactions = []
  @observable.ref selectedTransaction = null
  // @observable unspendTransactions = []
  @observable txFetcherInfo = {
    isLoading: false,
    isRefreshing: false,
    page: 1,
    hasMoreData: true
  }

  belongsToWalletAddress = null

  static fetchTokenDetail = (address, contract) => {
    return API.fetchTokenDetail(address, contract).then(res => new WalletToken(res.data.data, address))
  }

  constructor(obj, belongsToWalletAddress) {
    const { tokenInfo } = obj
    this.balance = new BigNumber(`${obj.balance}`)
    this.title = tokenInfo.name
    this.address = tokenInfo.address !== '' ? tokenInfo.address : belongsToWalletAddress
    this.decimals = tokenInfo.decimals
    this.symbol = tokenInfo.symbol
    this.rate = tokenInfo.price ? new BigNumber(`${tokenInfo.price.rate}`) : new BigNumber(0)

    // For identify
    this.belongsToWalletAddress = belongsToWalletAddress
  }

  @action setSelectedTransaction = (tx) => { this.selectedTransaction = tx }

  @action setBalance = (v) => { this.balance = v }

  @action async addUnspendTransaction(obj) {
    const unspendTx = Transaction.generateUnspendTransaction(obj, this)
    await UnspendTransactionDS.addTransaction(unspendTx)
    return unspendTx
  }

  @computed get unspendTransactions() {
    const transactions = appState.unpendTransactions
    const walletAddress = appState.selectedWallet.address.toLowerCase()
    return transactions
      .filter((t) => {
        return (walletAddress === t.from.toLowerCase() || walletAddress === t.to.toLowerCase()) &&
          this.symbol === t.tokenSymbol
      })
  }

  @computed get allTransactions() {
    return [...this.unspendTransactions.slice(), ...this.transactions.slice()]
  }

  @computed get successTransactions() {
    return this.transactions
  }

  @computed get balanceInDollar() {
    return this.rate.times(this.balanceToken)
  }

  @computed get balanceToken() {
    return this.balance.dividedBy(new BigNumber(`1.0e+${this.decimals}`))
  }

  @computed get isRefreshing() {
    return this.txFetcherInfo.isRefreshing
  }

  @computed get isLoading() {
    return this.txFetcherInfo.isLoading
  }

  @action offLoading = (hasNext = false, page = 1) => {
    this.txFetcherInfo = {
      isLoading: false,
      isRefreshing: false,
      hasMoreData: hasNext,
      page
    }
  }

  @action fetchTransactions = async (isRefresh = false) => {
    if (this.isLoading || this.isRefreshing || !this.txFetcherInfo.hasMoreData) return
    if (isRefresh) {
      this.txFetcherInfo = {
        ...this.txFetcherInfo,
        isRefreshing: true,
        page: 1
      }
    } else {
      this.txFetcherInfo.isLoading = true
    }

    let data = {}

    const { address } = appState.selectedWallet

    if (address === this.address) {
      data = {
        module: 'account',
        action: 'txlist',
        address,
        startblock: 0,
        sort: 'desc',
        endblock: 99999999,
        offset: 16,
        apikey: 'SVUJNQSR2APDFX89JJ1VKQU4TKMB6W756M'
      }
    } else {
      data = {
        module: 'account',
        action: 'tokentx',
        address,
        contractaddress: this.address,
        offset: 16,
        sort: 'desc',
        symbol: this.title
      }
    }

    API.fetchTransactions(this.address, data, this.txFetcherInfo.page).then((res) => {
      let txArr = res.data.result.map(t => new Transaction(t, this)).reduce((_result, _tx) => {
        const result = _result
        const tx = _tx
        tx.isSelf = !!result[tx.hash]
        result[tx.hash] = tx
        return result
      }, {})
      txArr = Object.keys(txArr).map(s => txArr[s])
      if (this.txFetcherInfo.page === 1) {
        this.transactions = txArr
      } else {
        this.transactions = [...this.transactions.slice(), ...txArr]
      }

      this.offLoading(true, this.txFetcherInfo.page + 1)
    }).catch((_) => {
      this.offLoading(false, this.txFetcherInfo.page)
    })
  }
}
