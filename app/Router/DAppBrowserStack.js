import { StackNavigator } from 'react-navigation'
import DAppBrowserScreen from '../modules/DAppBrowser/DAppBrowserScreen'
import DAppConfirmScreen from '../modules/DAppBrowser/screen/DappConfirmScreen'
import AppStyle from '../commons/AppStyle'

const DAppBrowserStack = StackNavigator(
  {
    DAppBrowserScreen: {
      screen: DAppBrowserScreen,
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
    initialRouteName: 'DAppBrowserScreen',
    cardStyle: { backgroundColor: AppStyle.backgroundColor }
  }
)

export default DAppBrowserStack
