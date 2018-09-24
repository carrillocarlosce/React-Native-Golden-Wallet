import { observable, action, computed } from 'mobx'
import MainStore from '../../AppStores/MainStore'
import { generateNew } from '../../AppStores/stores/Wallet'
import NavStore from '../../AppStores/NavStore'
import NotificationStore from '../../AppStores/stores/Notification'
import AppStyle from '../../commons/AppStyle'
import Router from '../../AppStores/Router'
import Keystore from '../../../Libs/react-native-golden-keystore'
import { chainNames } from '../../Utils/WalletAddresses'

class CreateWalletStore {
  @observable customTitle = ``
  @observable finished = false
  @observable loading = false

  @action setTitle(title) {
    this.customTitle = title
  }

  @action handleCreateWallet(coin = chainNames.ETH) {
    this.loading = true
    const ds = MainStore.secureStorage
    let index = 0
    let coinPath = ''
    if (coin === chainNames.ETH) {
      coinPath = Keystore.CoinType.ETH.path
      index = MainStore.appState.currentWalletIndex
    } else if (coin === chainNames.BTC) {
      coinPath = Keystore.CoinType.BTC.path
      index = MainStore.appState.currentBTCWalletIndex
    }
    const { title } = this
    generateNew(ds, title, index, coinPath, coin).then(async (w) => {
      this.finished = true
      NotificationStore.addWallet(title, w.address, w.type === 'ethereum' ? 'ETH' : 'BTC')
      NavStore.showToastTop(`${title} was successfully created!`, {}, { color: AppStyle.colorUp })
      MainStore.appState.appWalletsStore.addOne(w)
      MainStore.appState.autoSetSelectedWallet()
      if (coin === chainNames.ETH) {
        MainStore.appState.setCurrentWalletIndex(index + 1)
      } else if (coin === chainNames.BTC) {
        MainStore.appState.setCurrentBTCWalletIndex(index + 1)
      }
      MainStore.appState.save()
      MainStore.appState.selectedWallet.fetchingBalance()
      this.loading = false
      NavStore.reset()
    }, ds)
  }

  @computed get title() {
    return this.customTitle
  }

  @computed get titleMap() {
    const { wallets } = MainStore.appState
    return wallets.reduce((rs, w) => {
      const result = rs
      result[w.title] = 1
      return result
    }, {})
  }

  @computed get isShowError() {
    const title = this.customTitle
    return !this.finished && this.titleMap[title]
  }

  @computed get isReadCreate() {
    return this.title !== '' && !this.isShowError
  }

  showAlertBackup = () => {
    NavStore.popupCustom.show(
      'No backup, No wallet!',
      [
        {
          text: 'Later',
          onClick: () => {
            NavStore.popupCustom.hide()
          }
        },
        {
          text: 'Backup now',
          onClick: () => {
            NavStore.popupCustom.hide()
            this.onBackup()
          }
        }
      ],
      'The Recovery Phrase protects your wallet and can be used to restore your assets if your device will be lost or damaged. Don’t skip the backup step!'
    )
  }

  onBackup = () => {
    NavStore.lockScreen({
      onUnlock: async (pincode) => {
        await Router.Backup.gotoBackup(pincode)
      }
    }, true)
  }
}

export default CreateWalletStore
