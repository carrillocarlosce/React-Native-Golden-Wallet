import { StackNavigator } from 'react-navigation'
import BackupFirstStepScreen from '../modules/WalletBackup/screen/BackupFirstStepScreen'
import BackupSecondStepScreen from '../modules/WalletBackup/screen/BackupSecondStepScreen'
import BackupThirdStepScreen from '../modules/WalletBackup/screen/BackupThirdStepScreen'
import AppStyle from '../commons/AppStyle'

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

export default BackupStack
