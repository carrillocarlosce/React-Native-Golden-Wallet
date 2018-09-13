import NavStore from '../NavStore'
import MainStore from '../MainStore'
import AddressBookStore from '../../modules/AddressBook/AddressBookStore'

class AddressBook {
  gotoAddAddressBook() {
    MainStore.addressBookStore = new AddressBookStore()
    NavStore.pushToScreen('AddAddressBookScreen')
  }
}

export default new AddressBook()
