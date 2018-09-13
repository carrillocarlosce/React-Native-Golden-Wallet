import MainStore from '../MainStore'
import ChangePincodeStore from '../../modules/ChangePincode/stores/ChangePincodeStore'
import NavStore from '../NavStore'

class ChangePinCode {
  goToChangePincode() {
    MainStore.changePincode = new ChangePincodeStore()
    NavStore.pushToScreen('ChangePincodeScreen')
  }
}

export default new ChangePinCode()
