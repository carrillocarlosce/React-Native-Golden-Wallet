import FCM, { FCMEvent } from 'react-native-fcm'
import { Platform } from 'react-native'
import Permissions from 'react-native-permissions'
import NotificationStore from '../AppStores/stores/Notification'
import MainStore from '../AppStores/MainStore'

class PushNotificationHelper {
  init() {
    FCM.getFCMToken().then((token) => {
      NotificationStore.setDeviceToken(token)
    })

    FCM.setBadgeNumber(0)

    FCM.getInitialNotification().then((notif) => {
      if (notif && notif.tx) {
        NotificationStore.isInitFromNotification = true
        MainStore.appState.BgJobs.CheckPendingTransaction.doOnce()
        NotificationStore.setCurrentNotif(notif)
        // NotificationStore.gotoTransactionList()
      }
    })

    FCM.on(FCMEvent.Notification, (notif) => {
      if (!MainStore.appState.enableNotification) {
        return
      }
      if (!notif.tx) {
        return
      }

      MainStore.appState.BgJobs.CheckPendingTransaction.doOnce()
      NotificationStore.setCurrentNotif(notif)
      if (notif && notif.opened_from_tray) {
        NotificationStore.gotoTransactionList()
      }
      MainStore.appState.BgJobs.CheckBalance.doOnce(false, false)
      MainStore.appState.BgJobs.CheckBalance.start()
    })

    FCM.on(FCMEvent.RefreshToken, (token) => {
      if (!MainStore.appState.enableNotification) {
        return
      }
      if (NotificationStore.deviceToken === token) {
        return
      }
      NotificationStore.setDeviceToken(token)
      NotificationStore.addWallets()
    })

    FCM.removeAllDeliveredNotifications()

    if (Platform.OS === 'android') {
      if (MainStore.appState.enableNotification) {
        MainStore.appState.setEnableNotification(true)
      }
    } else {
      Permissions.check('notification').then((response) => {
        if (response === 'authorized') {
          if (MainStore.appState.enableNotification) {
            MainStore.appState.setEnableNotification(true)
          }
        } else if (response === 'undetermined') {
          this.requestPermission()
          MainStore.appState.setEnableNotification(true)
        } else {
          MainStore.appState.setEnableNotification(false)
        }
      }).catch((e) => {
        console.log(e)
      })
    }
  }

  requestPermission() {
    return FCM.requestPermissions({ badge: true, sound: true, alert: false })
  }

  removeAllDeliveredNotifications = () => {
    FCM.removeAllDeliveredNotifications()
  }

  setBadgeNumber(number) {
    FCM.setBadgeNumber(0)
  }

  checkPermission() {
    return Permissions.check('notification')
  }
}

export default new PushNotificationHelper()
