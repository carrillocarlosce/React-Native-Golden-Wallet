import MainStore from '../../../AppStores/MainStore'
import NotificationStore from '../../../AppStores/stores/Notification'

export default class ManageWalletStore {
  async editWallet(wallet) {
    // await wallet.update()
    MainStore.appState.appWalletsStore.save()
  }

  async removeWallet(wallet) {
    // await wallet.remove()
    await NotificationStore.removeWallet(wallet.address)
    MainStore.appState.appWalletsStore.removeOne(wallet)
  }
}
