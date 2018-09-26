import { action } from 'mobx'
import WalletToken from './WalletToken'

export default class WalletTokenBTC extends WalletToken {
  @action fetchTransactions = async (isRefresh = false) => {

  }
}
