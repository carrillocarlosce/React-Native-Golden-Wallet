import * as wallet from './wallet'
import * as infura from './infura'
import * as NotificationAPI from './NotificationAPI'

export default {
  ...wallet,
  infura: { ...infura },
  ...NotificationAPI
}
