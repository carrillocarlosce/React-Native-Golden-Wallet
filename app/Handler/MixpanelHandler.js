import Mixpanel from 'react-native-mixpanel'

export default class MixpanelHandler {
  static eventName = {
    ACTION_SEND: 'Action Send', // amount, token, inputType, fee
    SEND_SUCCESS: 'Send Success', // amount, token, inputType, fee
    SEND_FAIL: 'Send Fail', // amount, token, inputType, fee
    START_SEND: 'Start Send',

    CREATE_WALLET: 'Create Wallet',
    IMPORT_WALLET: 'Import Wallet', // importType, inputType

    ACTION_BACKUP: 'Backup',
    BACKUP_SUCCESS: 'Backup Success',

    ADDRESS_COPIED: 'Address Copied',
    ACTION_SHARE: 'Share Address',

    UNLOCK_PIN_FAIL: 'Unlock Pin Fail', // countFail

    ACTION_MANAGE_WALLET_ADD_PRIVATE_KEY: 'Manage Wallet Add Private Key',
    ACTION_MANAGE_WALLET_EXPORT_PRIVATE_KEY: 'Manage Wallet Export Private Key',
    ACTION_MANAGE_WALLET_REMOVE: 'Manage Wallet Remove',
    ACTION_MANAGE_WALLET_EDIT: 'Manage Wallet Edit',

    ACTION_ADD_ADDRESS_BOOK: 'Add Address Book', // inputType

    ACTION_CHANGE_PINCODE: 'Change Pincode',
    ACTION_CHANGE_NETWORK: 'Change Network', // network
    ACTION_VIEW_SOURCE_CODE: 'View Source Code',
    ACTION_JOIN_TELEGRAM: 'Join Telegram Group',
    ACTION_VIEW_TWITTER: 'Follow Twitter',

    VIEW_COLLETIBLES: 'View Collectibles',
    VIEW_COLLETIBLES_DETAIL: 'View Collectibles Detail',
    OPEN_COLLETIBLES_DAPP: 'Open Collectibles DApp',

    EXPLORE_DAPPS: 'Explores DApp', // dapp
    DAPP_TRANSACTION: 'DApp Transaction' // dapp
  }

  constructor() {
    Mixpanel.sharedInstanceWithToken('227467372e7fe53dac6fea17eba63718')
  }

  track(eventName) {
    Mixpanel.track(eventName)
  }

  trackWithProperties(eventName, props) {
    Mixpanel.trackWithProperties(eventName, props)
  }
}