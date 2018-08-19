import MainStore from '../../../AppStores/MainStore'
import NotificationStore from '../../../AppStores/stores/Notification'
import NavStore from '../../../stores/NavStore'

export default class AppSettingStore {
  switchEnableNotification(isEnable) {
    if (MainStore.appState.internetConnection === 'offline') {
      NavStore.popupCustom.show('Network Error.')
      return
    }
    MainStore.appState.setEnableNotification(isEnable)
    if (isEnable) {
      NotificationStore.addWallets().then((res) => {
        if (!res) {
          MainStore.appState.setEnableNotification(!isEnable)
          NavStore.popupCustom.show('Can not turn on Notification.')
        }
      })
    } else {
      NotificationStore.removeWallets().then((results) => {
        for (let i = 0; i < results.length; i++) {
          const res = results[i]
          if (!res.data.success && res.data.data.error !== 'not found') {
            MainStore.appState.setEnableNotification(!isEnable)
            NavStore.popupCustom.show('Can not turn off Notification.')
            break
          }
        }
      })
    }
  }
}
