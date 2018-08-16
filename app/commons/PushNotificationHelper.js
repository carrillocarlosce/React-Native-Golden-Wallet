import FCM, {
  FCMEvent,
  RemoteNotificationResult,
  WillPresentNotificationResult,
  NotificationType
} from 'react-native-fcm'
import { Platform } from 'react-native'
import Permissions from 'react-native-permissions'
import NotificationStore from '../AppStores/stores/Notification'
import MainStore from '../AppStores/MainStore'

class PushNotificationHelper {
  init() {
    FCM.getFCMToken().then((token) => {
      console.log(token)
      NotificationStore.setDeviceToken(token)
    })

    FCM.getInitialNotification().then((notif) => {
      if (notif.tx) {
        NotificationStore.setCurrentNotif(notif)
        NotificationStore.gotoTransactionList()
      }
    })

    FCM.on(FCMEvent.Notification, (notif) => {
      NotificationStore.setCurrentNotif(notif)
      if (notif && notif.opened_from_tray) {
        NotificationStore.gotoTransactionList()
      }
      if (Platform.OS === 'ios') {
        switch (notif._notificationType) {
          case NotificationType.Remote:
            notif.finish(RemoteNotificationResult.NewData)
            break
          case NotificationType.NotificationResponse:
            notif.finish()
            break
          case NotificationType.WillPresent:
            notif.finish(WillPresentNotificationResult.All)
            break
          default:
        }
      }
    })
    FCM.removeAllDeliveredNotifications()

    Permissions.check('notification').then((response) => {
      if (response === 'authorized') {
        MainStore.appState.setEnableNotification(true)
      } else if (response === 'undetermined') {
        PushNotificationHelper.requestPermission().then((res) => {
          if (res === 'authorized') {
            MainStore.appState.setEnableNotification(true)
          } else {
            MainStore.appState.setEnableNotification(false)
          }
        })
      } else {
        MainStore.appState.setEnableNotification(false)
      }
    }).catch((e) => {
      console.log(e)
    })

    if (Platform.OS === 'android') {
      MainStore.appState.setEnableNotification(true)
    }
  }

  requestPermission() {
    return FCM.requestPermissions({ badge: true, sound: true, alert: true })
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
