import MainStore from '../MainStore'
import SendStore from '../../modules/SendTransaction/stores/SendStore'
import NavStore from '../NavStore'

class SendTransaction {
  goToSendTx() {
    MainStore.sendTransaction = new SendStore()
    NavStore.pushToScreen('SendTransactionStack')
  }
}

export default new SendTransaction()
