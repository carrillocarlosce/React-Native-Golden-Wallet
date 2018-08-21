import { observable, action, computed, autorun } from 'mobx'
import BigNumber from 'bignumber.js'
import Config from './stores/Config'
import Constants from '../commons/constant'
import WalletDS from './DataSource/WalletDS'
import AppDS from './DataSource/AppDS'
import Reactions from './Reactions'
import AddressBookDS from './DataSource/AddressBookDS'
import UnspendTransactionDS from './DataSource/UnspendTransactionDS'
import NotificationStore from './stores/Notification'
import BgJobs from './BackgroundJobs'
import api from '../api'

// const defaultAppData = {
//   config: new Config('mainnet', Constants.INFURA_API_KEY),
//   defaultWallet: null, // for web3 dapp
//   selectedWallet: null, // for sending transaction
//   selectedToken: null, // for sending transaction
//   wallets: [],
//   addressBooks: [],
//   rateETHDollar: 412.0,
//   hasPassword: false
// }

// Current app state

class AppState {
  dataVersion = '1'
  @observable config = new Config('mainnet', Constants.INFURA_API_KEY)
  @observable defaultWallet = null // for web3 dapp
  @observable selectedWallet = null // for sending transaction
  @observable selectedToken = null // for sending transaction
  @observable wallets = []
  @observable addressBooks = []
  @observable rateETHDollar = new BigNumber(0)
  @observable hasPassword = false
  @observable didBackup = false
  currentWalletIndex = 0
  @observable internetConnection = 'online' // online || offline
  @observable unpendTransactions = []
  @observable gasPriceEstimate = {
    slow: 2,
    standard: 10,
    fast: 60
  }
  @observable enableNotification = true

  static TIME_INTERVAL = 20000

  constructor() {
    this.BgJobs = {
      CheckBalance: new BgJobs.CheckBalance(this, this.TIME_INTERVAL),
      CheckPendingTransaction: new BgJobs.CheckPendingTransaction(this, this.TIME_INTERVAL)
    }
  }

  startAllServices() {
    Reactions.auto.listenConfig(this)
    Reactions.auto.listenConnection(this)
    this.getRateETHDollar()
    this.BgJobs.CheckBalance.start()
    this.BgJobs.CheckPendingTransaction.start()
    this.getGasPriceEstimate()
  }

  @action setConfig = (cf) => { this.config = cf }
  @action setBackup = (isBackup) => { this.didBackup = isBackup }
  @action setSelectedWallet = (w) => { this.selectedWallet = w }
  @action setInternetConnection = (ic) => { this.internetConnection = ic }
  @action setselectedToken = (t) => { this.selectedToken = t }
  @action setUnpendTransactions = (ut) => { this.unpendTransactions = ut }
  @action setEnableNotification = (isEnable) => {
    this.enableNotification = isEnable
    this.save()
  }

  @action async syncWallets() {
    await WalletDS.getWallets().then((_wallets) => {
      const wallets = _wallets
      const walletMap = wallets.reduce((_rs, w, i) => {
        const rs = _rs
        rs[w.address] = i
        return rs
      }, {})

      this.wallets.forEach((w) => {
        const index = walletMap[w.address]
        wallets[index] = w
      })

      this.wallets = wallets
    })
  }

  @action async syncAddressBooks() {
    await AddressBookDS.getAddressBooks().then((_addressBooks) => {
      const addressBooks = _addressBooks
      const addressBookMap = addressBooks.reduce((_rs, ab, i) => {
        const rs = _rs
        rs[ab.address] = i
        return rs
      }, {})

      this.addressBooks.forEach((ab) => {
        const index = addressBookMap[ab.address]
        addressBooks[index] = ab
      })

      this.addressBooks = addressBooks
    })
  }

  @action autoSetSelectedWallet() {
    const lastIndex = this.wallets.length - 1
    if (lastIndex < 0) this.setSelectedWallet(null)

    this.setSelectedWallet(this.wallets[lastIndex])
  }

  @action setHasPassword(hasPassword) {
    this.hasPassword = hasPassword
  }

  @action setCurrentWalletIndex(index) {
    this.currentWalletIndex = index
  }

  @action async getRateETHDollar() {
    setTimeout(async () => {
      if (this.internetConnection === 'online') {
        const rs = await api.fetchRateETHDollar()
        const rate = rs.data && rs.data.RAW && rs.data.RAW.ETH && rs.data.RAW.ETH.USD

        if (rate.PRICE != this.rateETHDollar) {
          this.rateETHDollar = new BigNumber(rate.PRICE)
        }
      }
    }, 100)
  }

  @action async getGasPriceEstimate() {
    setTimeout(async () => {
      if (this.config.network === Config.networks.mainnet && this.internetConnection === 'online') {
        const res = await api.fetchGasPrice()
        this.gasPriceEstimate = {
          slow: res.data ? Math.floor(res.data.safeLow / 10) : Math.floor(this.gasPriceEstimate.slow / 10),
          standard: res.data ? Math.floor(res.data.average / 10) : Math.floor(this.gasPriceEstimate.standard / 10),
          fast: res.data ? Math.floor(res.data.fastest / 10) : Math.floor(this.gasPriceEstimate.fast / 10)
        }
      }
    }, 0)
  }

  @action async import(orgData) {
    const data = orgData
    this.config = new Config(data.config.network, data.config.infuraKey)
    this.hasPassword = data.hasPassword
    this.enableNotification = data.enableNotification !== undefined ? data.enableNotification : true
    this.currentWalletIndex = data.currentWalletIndex
    const wallets = await WalletDS.getWallets()
    const addressBooks = await AddressBookDS.getAddressBooks()
    this.addressBooks = addressBooks
    const unspendTransactions = await UnspendTransactionDS.getTransactions()
    this.unpendTransactions = unspendTransactions
    this.wallets = wallets

    if (wallets.length > 0) {
      this.setSelectedWallet(this.wallets[0])
    }
    // if (data.defaultWallet) {
    //   this.defaultWallet = wallets.find(w => w.address === data.defaultWallet)
    // }

    // if (data.selectedWallet) {
    //   this.selectedWallet = wallets.find(w => w.address === data.selectedWallet)
    // }

    this.rateETHDollar = new BigNumber(data.rateETHDollar || 0)
    this.gasPriceEstimate = data.gasPriceEstimate
    // this.BgJobs.CheckBalance.doOnce(false)

    if (NotificationStore.notif) NotificationStore.gotoTransactionList()
  }

  @computed get isShowSendButton() {
    const wallet = this.selectedWallet
    if (!wallet) {
      return false
    }
    return wallet.canSendTransaction
  }

  @computed get networkName() {
    return this.config.network
  }

  save() {
    return AppDS.saveAppData(this.toJSON())
  }

  // for local storage: be careful with MobX observable
  toJSON() {
    // const addressBooksJS = this.addressBooks.map(adr => adr.toJSON())

    return {
      dataVersion: this.dataVersion,
      config: this.config.toJSON(),
      defaultWallet: this.defaultWallet ? this.defaultWallet.address : null,
      selectedWallet: this.selectedWallet ? this.selectedWallet.address : null,
      selectedToken: this.selectedToken ? this.selectedToken.address : null,
      // addressBooks: addressBooksJS,
      hasPassword: this.hasPassword,
      rateETHDollar: this.rateETHDollar.toString(10),
      currentWalletIndex: this.currentWalletIndex,
      didBackup: this.didBackup,
      gasPriceEstimate: this.gasPriceEstimate,
      enableNotification: this.enableNotification
    }
  }
}

export default new AppState()
