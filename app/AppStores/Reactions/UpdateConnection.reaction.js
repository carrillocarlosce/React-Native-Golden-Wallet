import { reaction } from 'mobx'

export default (appState) => {
  return reaction(
    () => appState.internetConnection,
    () => {
      if (appState.internetConnection === 'offline') return
      appState.wallets.forEach((w) => {
        w.offLoading()
        w.fetchingBalance()
        w.tokens.forEach((t) => {
          t.fetchTransactions(true)
        })
      })
      appState.getGasPriceEstimate()
      appState.loadPendingTxs()
    }
  )
}
