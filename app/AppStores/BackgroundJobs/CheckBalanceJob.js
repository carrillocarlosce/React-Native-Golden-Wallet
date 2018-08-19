export default class CheckBalanceJob {
  appState = null
  checkBalanceJobID = null
  timeInterval = 20000
  ignoreSelectedWallet = false

  constructor(appState, timeInterval = 20000) {
    this.appState = appState
    this.timeInterval = timeInterval
  }

  fetchWalletsBalance(isRefeshing, isBg) {
    if (this.appState.internetConnection === 'online') {
      this.appState.wallets.forEach((w) => {
        if (this.ignoreSelectedWallet && w.address === this.appState.selectedWallet.address) {
          return
        }
        w.fetchingBalance(isRefeshing, isBg)
      })
    }
  }

  startCheckBalanceJob() { }

  doOnce(isRefeshing, isBg) {
    this.fetchWalletsBalance(isRefeshing, isBg)
  }

  start() {
    this.stop() // ensure not have running job
    this.checkBalanceJobID = setTimeout(() => {
      this.fetchWalletsBalance(false, true)
      this.start()
    }, this.timeInterval)
  }

  stop() {
    if (this.checkBalanceJobID) clearTimeout(this.checkBalanceJobID)
    this.checkBalanceJobID = null
  }

  isRunning() {
    return this.checkBalanceJobID !== null
  }
}
