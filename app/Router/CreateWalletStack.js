import { StackNavigator } from 'react-navigation'
import CreateWalletScreen from '../modules/WalletCreate/screen/CreateWalletScreen'
import ImportViaAddressScreen from '../modules/WalletImport/screen/ImportViaAddressScreen'
import ImportViaMnemonicScreen from '../modules/WalletImport/screen/ImportViaMnemonicScreen'
import ImportViaPrivateKeyScreen from '../modules/WalletImport/screen/ImportViaPrivateKeyScreen'
import ChooseAddressScreen from '../modules/WalletImport/screen/ChooseAddressScreen'
import ScanQRCodeScreen from '../modules/ScanQRCode'
import EnterNameViaMnemonic from '../modules/WalletImport/screen/EnterNameViaMnemonic'
import AppStyle from '../commons/AppStyle'
import ImportWalletScreen from '../modules/WalletImport/screen/ImportWalletScreen'
import WalletTypeImportScreen from '../modules/WalletImport/screen/ImportTypeWalletScreen'
import WalletTypeCreateScreen from '../modules/WalletCreate/screen/WalletTypeCreateScreen'

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
    },
    WalletTypeImportScreen: {
      screen: WalletTypeImportScreen,
      navigationOptions: {
        header: null
      }
    },
    WalletTypeCreateScreen: {
      screen: WalletTypeCreateScreen,
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

export default CreateWalletStack
