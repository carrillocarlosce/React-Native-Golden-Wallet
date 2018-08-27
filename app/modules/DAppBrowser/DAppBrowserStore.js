import { observable, computed, action } from 'mobx'
import AppState from '../../AppStores/AppState'

export default class DAppBrowserStore {
  @computed get walletAddress() {
    return AppState.selectedWallet.address
  }
}
