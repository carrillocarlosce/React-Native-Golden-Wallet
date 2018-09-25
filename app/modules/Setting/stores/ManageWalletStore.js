import { observable, action, computed } from 'mobx'
import MainStore from '../../../AppStores/MainStore'
import NotificationStore from '../../../AppStores/stores/Notification'
import NavStore from '../../../AppStores/NavStore'
import SecureDS from '../../../AppStores/DataSource/SecureDS'
import GetAddress, { chainNames } from '../../../Utils/WalletAddresses'
import Checker from '../../../Handler/Checker'

export default class ManageWalletStore {
  @observable options = [
    {
      mainText: 'Edit Wallet Name',
      onPress: () => {
        NavStore.pushToScreen('EditWalletNameScreen', {
          wallet: this.selectedWallet,
          onEdited: () => NavStore.pushToScreen('ManageWalletScreen')
        })
      }
    },
    {
      mainText: 'Export Private Key',
      onPress: () => {
        this.onExportPrivateKey()
      }
    },
    {
      mainText: 'Enable Notification'
    }
  ]

  onExportPrivateKey = () => {
    NavStore.popupCustom.show(
      'WARNING!',
      [
        {
          text: 'Cancel',
          onClick: () => {
            NavStore.popupCustom.hide()
          }
        },
        {
          text: 'Continue',
          onClick: async (text) => {
            NavStore.popupCustom.hide()
            NavStore.lockScreen({
              onUnlock: (pincode) => {
                NavStore.showLoading()
                const ds = new SecureDS(pincode)
                this.getPrivateKey(ds).then((pk) => {
                  NavStore.hideLoading()
                  NavStore.pushToScreen('ExportPrivateKeyScreen', {
                    pk,
                    walletName: this.selectedWallet.title
                  })
                }).catch(e => NavStore.hideLoading())
              }
            }, true)
          }
        }
      ],
      'It is essential to understand that the Private Key is the most important and sensitive part of your account information.\n\nWhoever has knowledge of a Private Key has full control over the associated funds and assets.\n\nIt is important for restoring your account so you should never lose it, but also keep it top secret.'
    )
  }

  getPrivateKey(ds) {
    this.selectedWallet.setSecureDS(ds)
    return this.selectedWallet.derivePrivateKey()
  }

  @observable customTitle = ''
  @observable finished = false
  @observable.ref selectedWallet = {}
  @observable privKey = ''

  @action setPrivateKey = (pk) => { this.privKey = pk }

  @computed get isErrorPrivateKey() {
    if (this.privKey === '') {
      return false
    }
    return !this.finished && !Checker.checkPrivateKey(this.privKey)
  }

  @computed get isReadyCreate() {
    return this.privKey !== '' && !this.isErrorPrivateKey
  }

  @action setSelectedWallet = (w) => { this.selectedWallet = w }

  @action setTitle(title) {
    this.customTitle = title
  }

  @action backToDefault() {
    this.customTitle = ''
    this.finished = false
  }

  @computed get isAllowedToSave() {
    const title = this.customTitle
    const currentTitle = this.selectedWallet ? this.selectedWallet.title : ''
    return title !== '' && title != currentTitle && !this.isShowError
  }

  @computed get isAllowedToRemove() {
    return this.customTitle !== '' && !this.isShowErrorRemove
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
    const currentTitle = this.selectedWallet ? this.selectedWallet.title : ''
    return !this.finished && title != currentTitle && this.titleMap[title]
  }

  @computed get isShowErrorRemove() {
    const title = this.customTitle
    return title != '' && !this.finished && title != this.selectedWallet.title
  }

  async editWallet(wallet) {
    MainStore.appState.appWalletsStore.save()
  }

  async removeWallet(wallet) {
    // await wallet.remove()
    await NotificationStore.removeWallet(wallet.address)
    MainStore.appState.appWalletsStore.removeOne(wallet)
  }

  @action async implementPrivateKey(selectedWallet, onAdded) {
    const coin = selectedWallet.type === 'ethereum' ? chainNames.ETH : chainNames.BTC
    const { address } = GetAddress(this.privKey, coin)
    if (selectedWallet.address.toLowerCase() !== address.toLowerCase()) {
      NavStore.popupCustom.show('This private key does not belong to your wallet')
      return
    }

    const ds = MainStore.secureStorage
    try {
      await selectedWallet.implementPrivateKey(ds, this.privKey)
      await MainStore.appState.appWalletsStore.save()
      this.finished = true
      onAdded()
    } catch (e) {
      NavStore.popupCustom.show(e.message)
    }
  }
  switchEnableNotification(isEnable, wallet) {
    const { title, address, type } = wallet
    if (MainStore.appState.internetConnection === 'offline') {
      NavStore.popupCustom.show('Network Error.')
      return
    }
    // MainStore.appState.wallets.forEach((w) => {
    //   if (wallet.address === w.address) w.setEnableNotification(isEnable)
    // })
    wallet.setEnableNotification(isEnable)
    wallet.update()
    if (isEnable) {
      const walletType = type === 'ethereum' ? 'ETH' : 'BTC'
      NotificationStore.addWallet(title, address, walletType).then(res => console.log(res))
    } else {
      NotificationStore.removeWallet(address).then(res => console.log(res))
    }
  }
}

// const manageWalletStore = new ManageWalletStore()
// export default manageWalletStore
