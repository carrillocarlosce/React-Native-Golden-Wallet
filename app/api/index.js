import * as wallet from './wallet'
import * as etherJSONRPC from './ether-json-rpc'
import * as NotificationAPI from './NotificationAPI'

export default {
  ...wallet,
  etherJSONRPC: { ...etherJSONRPC },
  ...NotificationAPI
}
