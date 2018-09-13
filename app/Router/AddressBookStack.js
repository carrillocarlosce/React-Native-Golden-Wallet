import { StackNavigator } from 'react-navigation'
import AddressBookScreen from '../modules/AddressBook/screen/AddressBookScreen'
import AddAddressBookScreen from '../modules/AddressBook/screen/AddAddressBookScreen'
import ScanQRCodeScreen from '../modules/ScanQRCode'
import AppStyle from '../commons/AppStyle'

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

export default AddressBookStack
