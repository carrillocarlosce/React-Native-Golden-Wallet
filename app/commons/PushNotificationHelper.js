import FCM, {
  FCMEvent,
  RemoteNotificationResult,
  WillPresentNotificationResult,
  NotificationType
} from 'react-native-fcm'
import { Platform } from 'react-native'
import Permissions from 'react-native-permissions'

class PushNotificationHelper {
  init() {
    FCM.getFCMToken().then((token) => {
      console.log(token)
    })

    FCM.getInitialNotification().then((notif) => {
      console.log(notif)
    })

    FCM.on(FCMEvent.Notification, (notif) => {
      console.log(notif)

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

    FCM.requestPermissions({ badge: true, sound: true, alert: true })
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
