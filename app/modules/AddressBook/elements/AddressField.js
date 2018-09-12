import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text
} from 'react-native'
import { observer } from 'mobx-react/native'
import InputWithAction from '../../../components/elements/InputWithActionItem'
import AppStyle from '../../../commons/AppStyle'
import MainStore from '../../../AppStores/MainStore'

@observer
export default class AddressField extends Component {
  constructor(props) {
    super(props)
    this.addressBookStore = MainStore.addressBookStore
  }

  onFocus = () => this.addressBookStore.setFieldFocus('address')
  onBlur = () => this.addressBookStore.setFieldFocus('')

  onChangeAddress = (text) => {
    this.addressBookStore.setAddress(text)
  }

  render() {
    const { address, errorAddressBook, isAddressFocus } = this.addressBookStore
    const color = { color: isAddressFocus ? AppStyle.mainColor : AppStyle.titleDarkModeColor }
    return (
      <View style={[{ marginTop: 20, marginHorizontal: 20 }]}>
        <Text style={[styles.textTitle, color]}>Address</Text>
        <InputWithAction
          ref={(ref) => { this.nameField = ref }}
          style={{ marginTop: 10 }}
          value={address}
          onChangeText={this.onChangeAddress}
          onFocus={this.onFocus}
          needPasteButton
          onBlur={this.onBlur}
        />
        {errorAddressBook !== '' &&
          <Text style={styles.errorText}>{errorAddressBook}</Text>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  textTitle: {
    fontSize: 16,
    fontFamily: AppStyle.mainFontSemiBold
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Semibold',
    color: AppStyle.errorColor,
    alignSelf: 'flex-start',
    marginTop: 10
  }
})
