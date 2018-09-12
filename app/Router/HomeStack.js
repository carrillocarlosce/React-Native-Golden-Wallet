import { StackNavigator } from 'react-navigation'
import HomeScreen from '../modules/WalletList/screen/HomeScreen'
import NetworkScreen from '../modules/Setting/screen/NetworkScreen'
import UnlockPincode from '../modules/ChangePincode/screen/UnlockPincode'
import AddAddressBookScreen from '../modules/AddressBook/screen/AddAddressBookScreen'
import ManageWalletDetailScreen from '../modules/Setting/screen/ManageWalletDetailScreen'
import ManageWalletScreen from '../modules/Setting/screen/ManageWalletScreen'
import EditWalletNameScreen from '../modules/Setting/screen/EditWalletNameScreen'
import RemoveWalletScreen from '../modules/Setting/screen/RemoveWalletScreen'
import AddPrivateKeyScreen from '../modules/Setting/screen/AddPrivateKeyScreen'
import ExportPrivateKeyScreen from '../modules/Setting/screen/ExportPrivateKeyScreen'
import TokenScreen from '../modules/WalletDetail/screen/TokenScreen'
import TransactionListScreen from '../modules/TransactionList/screen/TransactionListScreen'
import PrivacyTermsWebView from '../modules/Setting/screen/PrivacyTermsWebView'
import ImplementPrivateKeyScreen from '../modules/WalletImport/screen/ImplementPrivateKeyScreen'
import AddressBookScreen from '../modules/AddressBook/screen/AddressBookScreen'
import ScanQRCodeScreen from '../modules/ScanQRCode'
import TxHashWebViewScreen from '../modules/TransactionDetail/screen/TxHashWebView'
import PrivacyTermsScreen from '../modules/Setting/screen/PrivacyTermsScreen'
import AppVersionScreen from '../modules/Setting/screen/AppVersionScreen'
import TransactionDetailScreen from '../modules/TransactionDetail/screen/TransactionDetailScreen'
import CollectibleScreen from '../modules/Collectibles/screen/CollectibleScreen'
import CollectibleDetailScreen from '../modules/Collectibles/screen/CollectibleDetailScreen'
import CollectibleListScreen from '../modules/Collectibles/screen/CollectibleListScreen'
import DAppConfirmScreen from '../modules/DAppBrowser/screen/DappConfirmScreen'
import DAppListScreen from '../modules/DAppBrowser/screen/DAppListScreen'
import AppStyle from '../commons/AppStyle'

const HomeStack = StackNavigator(
  {
    HomeScreen: {
      screen: HomeScreen,
      navigationOptions: {
        header: null
      }
    },
    NetworkScreen: {
      screen: NetworkScreen,
      navigationOptions: {
        header: null
      }
    },
    ChangePincodeScreen: {
      screen: UnlockPincode,
      navigationOptions: {
        header: null
      }
    },
    AddAddressBookScreen: {
      screen: AddAddressBookScreen,
      navigationOptions: {
        header: null
      }
    },
    ManageWalletScreen: {
      screen: ManageWalletScreen,
      navigationOptions: {
        header: null
      }
    },
    ManageWalletDetailScreen: {
      screen: ManageWalletDetailScreen,
      navigationOptions: {
        header: null
      }
    },
    EditWalletNameScreen: {
      screen: EditWalletNameScreen,
      navigationOptions: {
        header: null
      }
    },
    RemoveWalletScreen: {
      screen: RemoveWalletScreen,
      navigationOptions: {
        header: null
      }
    },
    AddPrivateKeyScreen: {
      screen: AddPrivateKeyScreen,
      navigationOptions: {
        header: null
      }
    },
    ExportPrivateKeyScreen: {
      screen: ExportPrivateKeyScreen,
      navigationOptions: {
        header: null
      }
    },
    TokenScreen: {
      screen: TokenScreen,
      navigationOptions: {
        header: null
      }
    },
    TransactionListScreen: {
      screen: TransactionListScreen,
      navigationOptions: {
        header: null
      }
    },
    PrivacyTermsWebView: {
      screen: PrivacyTermsWebView,
      navigationOptions: {
        header: null
      }
    },
    ImplementPrivateKeyScreen: {
      screen: ImplementPrivateKeyScreen,
      navigationOptions: {
        header: null
      }
    },
    AddressBookScreen: {
      screen: AddressBookScreen,
      navigationOptions: {
        header: null
      }
    },
    ScanQRCodeScreen: {
      screen: ScanQRCodeScreen,
      navigationOptions: {
        header: null
      }
    },
    TxHashWebViewScreen: {
      screen: TxHashWebViewScreen,
      navigationOptions: {
        header: null
      }
    },
    PrivacyTermsScreen: {
      screen: PrivacyTermsScreen,
      navigationOptions: {
        header: null
      }
    },
    AppVersionScreen: {
      screen: AppVersionScreen,
      navigationOptions: {
        header: null
      }
    },
    TransactionDetailScreen: {
      screen: TransactionDetailScreen,
      navigationOptions: {
        header: null
      }
    },
    CollectibleScreen: {
      screen: CollectibleScreen,
      navigationOptions: {
        header: null
      }
    },
    CollectibleDetailScreen: {
      screen: CollectibleDetailScreen,
      navigationOptions: {
        header: null
      }
    },
    CollectibleListScreen: {
      screen: CollectibleListScreen,
      navigationOptions: {
        header: null
      }
    },
    DAppListScreen: {
      screen: DAppListScreen,
      navigationOptions: {
        header: null
      }
    },
    DAppConfirmScreen: {
      screen: DAppConfirmScreen,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    initialRouteName: 'HomeScreen',
    cardStyle: { backgroundColor: AppStyle.backgroundColor }
  }
)

export default HomeStack
