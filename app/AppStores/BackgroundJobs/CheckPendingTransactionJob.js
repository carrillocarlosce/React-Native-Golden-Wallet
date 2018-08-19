import UnspendTransactionDS from '../DataSource/UnspendTransactionDS'

export default class CheckPendingTransactionJob {
  appState = null
  jobId = null
  timeInterval = 20000

  constructor(appState, timeInterval = 20000) {
    this.appState = appState
    this.timeInterval = timeInterval
  }

  async checkUnpendTransactions() {
    if (this.appState.internetConnection === 'online') {
      const newUnpendTxs = []
      for (let i = 0; i < this.appState.unpendTransactions.length; i++) {
        const ut = this.appState.unpendTransactions[i]
        const canRemove = await ut.canRemove()
        if (!canRemove) newUnpendTxs.push(ut)
      }

      this.appState.setUnpendTransactions(newUnpendTxs)
      UnspendTransactionDS.saveTransactions(this.appState.unpendTransactions)
    }
  }

  doOnce() {
    this.checkUnpendTransactions()
  }

  start() {
    this.stop() // ensure not have running job
    this.jobId = setTimeout(async () => {
      await this.checkUnpendTransactions()
      this.start()
    }, this.timeInterval)
  }

  stop() {
    if (this.jobId) clearTimeout(this.jobId)
    this.jobId = null
  }

  isRunning() {
    return this.jobId !== null
  }
}
