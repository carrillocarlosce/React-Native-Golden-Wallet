import { observable, action, computed } from 'mobx'
import AddressBook from '../../AppStores/stores/AddressBook'
import MainStore from '../../AppStores/MainStore'
import Checker from '../../Handler/Checker'
import NavStore from '../../AppStores/NavStore'
import constant from '../../commons/constant'
import { chainNames } from '../../Utils/WalletAddresses'

export default class AddressBookStore {
  @observable title = ''
  @observable address = ''
  finished = false
  @observable fieldFocus = ''

  @action setTitle = (t) => { this.title = t }
  @action setAddress = (add) => { this.address = add }
  @action setFieldFocus = (ff) => { this.fieldFocus = ff }

  @action async saveAddressBook() {
    const ab = AddressBook.createNew(this.title, this.address, this.coin.toLowerCase())
    this.finished = true
    await ab.save()
    MainStore.appState.syncAddressBooks()
    NavStore.goBack()
  }

  get addressBookIsExisted() {
    return MainStore.appState.addressBooks.find(ab => ab.address === this.address.toLowerCase())
  }

  get titleIsExisted() {
    return MainStore.appState.addressBooks.find(ab => ab.title === this.title)
  }

  @computed get isNameFocus() {
    return this.fieldFocus === 'name'
  }

  @computed get isAddressFocus() {
    return this.fieldFocus === 'address'
  }

  @computed get isErrorTitle() {
    return !this.finished && this.titleIsExisted
  }

  get coin() {
    if (this.address.length === 34 && this.address.startsWith('3')) {
      return chainNames.BTC
    }
    return chainNames.ETH
  }

  @computed get errorAddressBook() {
    if (this.addressBookIsExisted && !this.finished) {
      return constant.ADDRESS_BOOK_EXISTED
    }
    if (!this.finished && this.address !== '' && !this.finished && !Checker.checkAddress(this.address, this.coin)) {
      return constant.INVALID_ADDRESS
    }
    return ''
  }

  @computed get isReadyCreate() {
    return this.address !== '' && this.title !== '' && this.errorAddressBook === '' && !this.titleIsExisted
  }
}
