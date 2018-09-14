import { StackNavigator } from 'react-navigation'
import HomeStack from './HomeStack'
import UnlockScreen from '../modules/Unlock/screen/UnlockScreen'
import CreateSendTransactionStack from './CreateSendTransactionStack'
import CreateWalletStack from './CreateWalletStack'
import BackupStack from './BackupStack'
import BackupFinishScreen from '../modules/WalletBackup/screen/BackupFinishScreen'
import AddressBookStack from './AddressBookStack'
import EnterNameScreen from '../modules/WalletCreate/screen/EnterNameScreen'
import NewUpdatedAvailableScreen from '../modules/WalletList/screen/NewUpdatedAvailableScreen'
import EnraseNotifScreen from '../modules/Unlock/screen/EnraseNotifScreen'
import SignMessageScreen from './../modules/DAppBrowser/screen/SignMessageScreen'
import DAppBrowserStack from './DAppBrowserStack'
import AppStyle from '../commons/AppStyle'

const Router = StackNavigator(
  {
    HomeStack: {
      screen: HomeStack,
      navigationOptions: {
        header: null
      }
    },
    UnlockScreen: {
      screen: UnlockScreen,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      }
    },
    SendTransactionStack: {
      screen: CreateSendTransactionStack,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      }
    },
    CreateWalletStack: {
      screen: CreateWalletStack,
      navigationOptions: {
        header: null
      }
    },
    BackupStack: {
      screen: BackupStack,
      navigationOptions: {
        header: null
      }
    },
    BackupFinishScreen: {
      screen: BackupFinishScreen,
      navigationOptions: {
        header: null
      }
    },
    AddressBookStack: {
      screen: AddressBookStack,
      navigationOptions: {
        header: null
      }
    },
    EnterNameScreen: {
      screen: EnterNameScreen,
      navigationOptions: {
        header: null
      }
    },
    NewUpdatedAvailableScreen: {
      screen: NewUpdatedAvailableScreen,
      navigationOptions: {
        header: null
      }
    },
    EnraseNotifScreen: {
      screen: EnraseNotifScreen,
      navigationOptions: {
        header: null
      }
    },
    DAppBrowserStack: {
      screen: DAppBrowserStack,
      navigationOptions: {
        header: null
      }
    },
    SignMessageScreen: {
      screen: SignMessageScreen,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    initialRouteName: 'HomeStack',
    cardStyle: { backgroundColor: AppStyle.backgroundColor },
    mode: 'modal'
  }
)

export default Router
