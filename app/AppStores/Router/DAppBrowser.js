import MainStore from '../MainStore'
import DAppStore from '../../modules/DAppBrowser/stores/DAppStore'

class DAppBrowser {
  goToDApp() {
    MainStore.dapp = new DAppStore()
  }
}

export default new DAppBrowser()
