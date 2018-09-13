import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text
} from 'react-native'
import { observer } from 'mobx-react/native'
import InputWithAction from '../../../components/elements/InputWithActionItem'
import AppStyle from '../../../commons/AppStyle'
import constant from '../../../commons/constant'
import MainStore from '../../../AppStores/MainStore'

@observer
export default class NameField extends Component {
  constructor(props) {
    super(props)
    this.addressBookStore = MainStore.addressBookStore
  }

  onFocus = () => this.addressBookStore.setFieldFocus('name')
  onBlur = () => this.addressBookStore.setFieldFocus('')

  onChangeTitle = (text) => {
    this.addressBookStore.setTitle(text)
  }

  focus() {
    this.nameField.focus()
  }

  render() {
    const { title, isErrorTitle, isNameFocus } = this.addressBookStore
    const color = { color: isNameFocus ? AppStyle.mainColor : AppStyle.titleDarkModeColor }
    return (
      <View style={[{ marginTop: 15, marginHorizontal: 20 }]}>
        <Text style={[styles.textTitle, color]}>Name</Text>
        <InputWithAction
          ref={(ref) => { this.nameField = ref }}
          style={{ marginTop: 10 }}
          value={title}
          onChangeText={this.onChangeTitle}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        />
        {isErrorTitle &&
          <Text style={styles.errorText}>{constant.EXISTED_NAME_AB}</Text>
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
