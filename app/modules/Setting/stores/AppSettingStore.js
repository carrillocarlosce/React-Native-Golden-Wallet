import MainStore from '../../../AppStores/MainStore'
import NotificationStore from '../../../AppStores/stores/Notification'

export default class AppSettingStore {
  switchEnableNotification(isEnable) {
    MainStore.appState.setEnableNotification(isEnable)
    if (isEnable) {
      NotificationStore.addWallets()
    } else {
      NotificationStore.removeWallets()
    }
  }
}
