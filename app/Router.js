import React, { Component } from 'react'
import { View } from 'react-native'
import { StackNavigator } from 'react-navigation'
import AppStyle from './commons/AppStyle'
import NavStore from './AppStores/NavStore'
import PopupCustom from './components/elements/PopupCustom'
import CustomToastTop from './components/elements/CustomToastTop'
import NotificationInApp from './components/elements/NotificationInApp'

// screen
import HomeScreen from './modules/WalletList/screen/HomeScreen'
import CreateWalletScreen from './modules/WalletCreate/screen/CreateWalletScreen'
import EnterNameScreen from './modules/WalletCreate/screen/EnterNameScreen'
import TransactionListScreen from './modules/TransactionList/screen/TransactionListScreen'
import ImportWalletScreen from './modules/WalletImport/screen/ImportWalletScreen'
import ImportViaMnemonicScreen from './modules/WalletImport/screen/ImportViaMnemonicScreen'
import ImportViaPrivateKeyScreen from './modules/WalletImport/screen/ImportViaPrivateKeyScreen'
import ImportViaAddressScreen from './modules/WalletImport/screen/ImportViaAddressScreen'
import ChooseAddressScreen from './modules/WalletImport/screen/ChooseAddressScreen'
import TokenScreen from './modules/WalletDetail/screen/TokenScreen'
import SendTransactionScreen from './modules/SendTransaction/screen/SendTransactionScreen'
import UnlockScreen from './modules/Unlock/screen/UnlockScreen'
import ScanQRCodeScreen from './modules/ScanQRCode'
import PrivacyTermsWebView from './modules/Setting/screen/PrivacyTermsWebView'
import ImplementPrivateKeyScreen from './modules/WalletImport/screen/ImplementPrivateKeyScreen'
import AddressBookScreen from './modules/AddressBook/screen/AddressBookScreen'
import AddAddressBookScreen from './modules/AddressBook/screen/AddAddressBookScreen'
import BackupFinishScreen from './modules/WalletBackup/screen/BackupFinishScreen'
import ManageWalletScreen from './modules/Setting/screen/ManageWalletScreen'
import TxHashWebViewScreen from './modules/TransactionDetail/screen/TxHashWebView'
import NetworkScreen from './modules/Setting/screen/NetworkScreen'
import AddressInputScreen from './modules/SendTransaction/screen/AddressInputScreen'
import EnterNameViaMnemonic from './modules/WalletImport/screen/EnterNameViaMnemonic'
import BackupFirstStepScreen from './modules/WalletBackup/screen/BackupFirstStepScreen'
import BackupSecondStepScreen from './modules/WalletBackup/screen/BackupSecondStepScreen'
import BackupThirdStepScreen from './modules/WalletBackup/screen/BackupThirdStepScreen'
import UnlockPincode from './modules/ChangePincode/screen/UnlockPincode'
import PrivacyTermsScreen from './modules/Setting/screen/PrivacyTermsScreen'
import ExportPrivateKeyScreen from './modules/Setting/screen/ExportPrivateKeyScreen'
import NewUpdatedAvailableScreen from './modules/WalletList/screen/NewUpdatedAvailableScreen'
import AppVersionScreen from './modules/Setting/screen/AppVersionScreen'
import EnraseNotifScreen from './modules/Unlock/screen/EnraseNotifScreen'
import DAppBrowserScreen from './modules/DAppBrowser/DAppBrowserScreen'
import DAppListScreen from './modules/DAppBrowser/screen/DAppListScreen'

const BackupStack = StackNavigator(
  {
    BackupFirstStepScreen: {
      screen: BackupFirstStepScreen,
      navigationOptions: {
        header: null
      }
    },
    BackupSecondStepScreen: {
      screen: BackupSecondStepScreen,
      navigationOptions: {
        header: null
      }
    },
    BackupThirdStepScreen: {
      screen: BackupThirdStepScreen,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    initialRouteName: 'BackupFirstStepScreen',
    cardStyle: { backgroundColor: AppStyle.backgroundColor }
  }
)

const AddressBookStack = StackNavigator(
  {
    AddressBookScreen: {
      screen: AddressBookScreen,
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
    ScanQRCodeScreen: {
      screen: ScanQRCodeScreen,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    initialRouteName: 'AddressBookScreen',
    cardStyle: { backgroundColor: AppStyle.backgroundColor }
  }
)

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
    DAppWebScreen: {
      screen: DAppBrowserScreen,
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

const CreateSendTransactionStack = StackNavigator(
  {
    SendTransactionScreen1: {
      screen: SendTransactionScreen,
      navigationOptions: {
        header: null
      }
    },
    AddressInputScreen: {
      screen: AddressInputScreen,
      navigationOptions: {
        header: null
      }
    },
    ScanQRCodeScreen: {
      screen: ScanQRCodeScreen,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    initialRouteName: 'SendTransactionScreen1',
    cardStyle: { backgroundColor: AppStyle.backgroundColor }
  }
)

const CreateWalletStack = StackNavigator(
  {
    CreateWalletScreen: {
      screen: CreateWalletScreen,
      navigationOptions: {
        header: null
      }
    },
    ImportWalletScreen: {
      screen: ImportWalletScreen,
      navigationOptions: {
        header: null
      }
    },
    ImportViaMnemonicScreen: {
      screen: ImportViaMnemonicScreen,
      navigationOptions: {
        header: null
      }
    },
    ImportViaPrivateKeyScreen: {
      screen: ImportViaPrivateKeyScreen,
      navigationOptions: {
        header: null
      }
    },
    ImportViaAddressScreen: {
      screen: ImportViaAddressScreen,
      navigationOptions: {
        header: null
      }
    },
    ChooseAddressScreen: {
      screen: ChooseAddressScreen,
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
    EnterNameViaMnemonic: {
      screen: EnterNameViaMnemonic,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    initialRouteName: 'CreateWalletScreen',
    cardStyle: { backgroundColor: AppStyle.backgroundColor }
  }
)

const DAppStack = StackNavigator(
  {
    DAppListScreen: {
      screen: DAppListScreen,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    initialRouteName: 'DAppListScreen',
    cardStyle: { backgroundColor: AppStyle.backgroundColor }
  }
)

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
    DAppStack: {
      screen: DAppStack,
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

export default class MainStack extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Router
          onNavigationStateChange={(prev, next) => NavStore.onNavigationStateChange(prev, next)}
          ref={(ref) => { NavStore.navigator = ref }}
        />
        <PopupCustom
          ref={(popup) => {
            NavStore.popupCustom = popup
          }}
        />
        <CustomToastTop
          ref={(ref) => {
            NavStore.toastTop = ref
          }}
        />
        <NotificationInApp />
      </View>
    )
  }
}
