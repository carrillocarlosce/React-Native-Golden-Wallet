import MainStore from '../../../AppStores/MainStore'
import NotificationStore from '../../../AppStores/stores/Notification'
import NavStore from '../../../AppStores/NavStore'

export default class AppSettingStore {
  switchEnableNotification(isEnable) {
    if (MainStore.appState.internetConnection === 'offline') {
      NavStore.popupCustom.show('Network Error.')
      return
    }
    MainStore.appState.setEnableNotification(isEnable)
    if (isEnable) {
      NotificationStore.onNotif().then(res => console.log(res))
    } else {
      NotificationStore.offNotif().then(res => console.log(res))
    }
  }
}
