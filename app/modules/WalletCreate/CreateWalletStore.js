import { observable, action, computed } from 'mobx'
import MainStore from '../../AppStores/MainStore'
import Wallet from '../../AppStores/stores/Wallet'
import NavStore from '../../AppStores/NavStore'
import NotificationStore from '../../AppStores/stores/Notification'
import AppStyle from '../../commons/AppStyle'

class CreateWalletStore {
  @observable customTitle = ``
  @observable finished = false
  @observable loading = false

  @action setTitle(title) {
    this.customTitle = title
  }

  @action handleCreateWallet() {
    this.loading = true
    const ds = MainStore.secureStorage
    const index = MainStore.appState.currentWalletIndex
    const { title } = this

    Wallet.generateNew(ds, title, index).then(async (w) => {
      this.finished = true
      NotificationStore.addWallet(title, w.address)
      NavStore.showToastTop(`${title} was successfully created!`, {}, { color: AppStyle.colorUp })
      await w.save()
      await MainStore.appState.syncWallets()
      MainStore.appState.autoSetSelectedWallet()
      MainStore.appState.setCurrentWalletIndex(index + 1)
      MainStore.appState.save()
      MainStore.appState.selectedWallet.fetchingBalance()
      this.loading = false
      NavStore.reset()
      if (!MainStore.appState.didBackup) {
        setTimeout(this.showAlertBackup, 2500)
      }
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
}

export default CreateWalletStore
