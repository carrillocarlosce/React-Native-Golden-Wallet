import { observable, action, computed } from 'mobx'
import AddressBook from '../../AppStores/stores/AddressBook'
import MainStore from '../../AppStores/MainStore'
import Checker from '../../Handler/Checker'
import NavStore from '../../AppStores/NavStore'
import constant from '../../commons/constant'

export default class AddressBookStore {
  @observable title = ''
  @observable address = ''
  finished = false

  @action setTitle = (t) => { this.title = t }
  @action setAddress = (add) => { this.address = add.toLowerCase() }

  @action async saveAddressBook() {
    const validate = Checker.checkAddress(this.address)
    if (!validate) {
      NavStore.popupCustom.show('Invalid Address')
      return
    }
    const ab = AddressBook.createNew(this.title, this.address)
    this.finished = true
    await ab.save()
    MainStore.appState.syncAddressBooks()
    NavStore.goBack()
  }

  get addressBookIsExisted() {
    return MainStore.appState.addressBooks.find(ab => ab.address === this.address)
  }

  get titleIsExisted() {
    return MainStore.appState.addressBooks.find(ab => ab.title === this.title)
  }

  @computed get isErrorTitle() {
    return !this.finished && this.titleIsExisted
  }

  @computed get errorAddressBook() {
    if (this.addressBookIsExisted && !this.finished) {
      return constant.ADDRESS_BOOK_EXISTED
    }
    if (!this.finished && this.address !== '' && !this.finished && !Checker.checkAddress(this.address)) {
      return constant.INVALID_ADDRESS
    }
    return ''
  }

  @computed get isReadyCreate() {
    return this.address !== '' && this.title !== '' && this.errorAddressBook === '' && !this.titleIsExisted
  }
}
