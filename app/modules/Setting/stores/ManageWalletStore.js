import MainStore from '../../../AppStores/MainStore'
import NotificationStore from '../../../AppStores/stores/Notification'

export default class ManageWalletStore {
  async editWallet(wallet) {
    await wallet.update()
    MainStore.appState.syncWallets()
  }

  async removeWallet(wallet) {
    await wallet.remove()
    await NotificationStore.removeWallet(wallet.address)
    MainStore.appState.syncWallets()
  }
}
