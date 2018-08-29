
import React, { Component } from 'react'
import {
  View,
  TouchableWithoutFeedback,
  // Dimensions,
  Text,
  Keyboard,
  Animated,
  StyleSheet,
  SafeAreaView,
  Platform
} from 'react-native'
import PropsType from 'prop-types'
import { observer } from 'mobx-react/native'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'
import LayoutUtils from '../../../commons/LayoutUtils'
import constant from '../../../commons/constant'
import ActionButton from '../../../components/elements/ActionButton'
import InputWithAction from '../../../components/elements/InputWithActionItem'
import commonStyle from '../../../commons/commonStyles'
import BottomButton from '../../../components/elements/BottomButton'
import Checker from '../../../Handler/Checker'
import AddressBookStore from '../AddressBookStore'

const marginTop = LayoutUtils.getExtraTop()
// const { height } = Dimensions.get('window')

@observer
export default class AddAddressBookScreen extends Component {
  static propTypes = {
    navigation: PropsType.object
  }

  static defaultProps = {
    navigation: null
  }

  constructor(props) {
    super(props)
    this.traslateTop = new Animated.Value(0)
    this.addressBookStore = new AddressBookStore()
    this.state = {
      isNameFocus: false,
      isAddressFocus: false
    }
  }

  componentDidMount() {
    const show = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hide = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'
    this.keyboardDidShowListener = Keyboard.addListener(show, e => this._keyboardDidShow(e))
    this.keyboardDidHideListener = Keyboard.addListener(hide, e => this._keyboardDidHide(e))
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  onChangeTitle = (text) => {
    this.addressBookStore.setTitle(text)
  }

  onChangeAddress = (text) => {
    this.addressBookStore.setAddress(text)
  }

  gotoScan = () => {
    const { navigation } = this.props
    setTimeout(() => {
      navigation.navigate('ScanQRCodeScreen', {
        title: 'Scan Address',
        marginTop,
        returnData: this.returnData.bind(this)
      })
    }, 300)
  }

  _runTraslateTop(toValue) {
    Animated.timing(
      // Animate value over time
      this.traslateTop, // The value to drive
      {
        toValue: -toValue, // Animate to final value of 1
        duration: 250
      }
    ).start()
  }

  _keyboardDidShow(e) {
    if (e.endCoordinates.screenY < 437 + marginTop + 15) {
      this._runTraslateTop(437 + marginTop - e.endCoordinates.screenY + 15)
    }
  }

  _keyboardDidHide() {
    this._runTraslateTop(0)
  }

  returnData(codeScanned) {
    const { addressBookStore } = this
    if (addressBookStore.name === '') {
      setTimeout(() => this.nameField.focus(), 250)
    }
    let address = codeScanned
    if (this.addressBookStore.title === '') {
      setTimeout(() => this.nameField.focus(), 250)
    }
    const resChecker = Checker.checkAddressQR(codeScanned)
    if (resChecker && resChecker.length > 0) {
      [address] = resChecker
    }
    addressBookStore.setAddress(address)
  }

  _renderNameField = (isNameFocus) => {
    const { title, isErrorTitle } = this.addressBookStore
    return (
      <View style={{ marginTop: 15, marginHorizontal: 20 }}>
        <Text style={{
          fontSize: 16,
          fontFamily: AppStyle.mainFontSemiBold,
          color: isNameFocus ? AppStyle.mainColor : AppStyle.titleDarkModeColor
        }}
        >Name
        </Text>
        <InputWithAction
          ref={(ref) => { this.nameField = ref }}
          style={{ marginTop: 10 }}
          value={title}
          onChangeText={this.onChangeTitle}
          onFocus={() => this.setState({ isNameFocus: true })}
          onBlur={() => this.setState({ isNameFocus: false })}
        />
        {isErrorTitle &&
          <Text style={styles.errorText}>{constant.EXISTED_NAME_AB}</Text>
        }
      </View>
    )
  }

  _renderAddressField = (isAddressFocus) => {
    const { address, errorAddressBook } = this.addressBookStore
    return (
      <View style={{ marginTop: 20, marginHorizontal: 20 }}>
        <Text style={{
          fontSize: 16,
          fontFamily: AppStyle.mainFontSemiBold,
          color: isAddressFocus ? AppStyle.mainColor : AppStyle.titleDarkModeColor
        }}
        >Address
        </Text>
        <InputWithAction
          style={{ marginTop: 10 }}
          styleTextInput={commonStyle.fontAddress}
          onChangeText={this.onChangeAddress}
          needPasteButton
          value={address}
          onFocus={() => this.setState({ isAddressFocus: true })}
          onBlur={() => this.setState({ isAddressFocus: false })}
        />
        {errorAddressBook !== '' &&
          <Text style={styles.errorText}>{errorAddressBook}</Text>
        }
      </View>
    )
  }

  _scanQRCodeButton() {
    return (
      <View style={{ marginTop: 20, alignSelf: 'center', flex: 1 }}>
        <ActionButton
          style={{
            height: 40
          }}
          buttonItem={{
            name: constant.SCAN_QR_CODE,
            icon: images.iconQrCode,
            background: '#121734'
          }}
          styleText={{ color: AppStyle.mainTextColor }}
          styleIcon={{ tintColor: AppStyle.mainTextColor }}
          action={this.gotoScan}
        />
      </View>
    )
  }

  _saveItem() {
    this.addressBookStore.saveAddressBook()
  }

  _renderSaveButton() {
    const { isReadyCreate } = this.addressBookStore
    return (
      <BottomButton
        disable={!isReadyCreate}
        onPress={() => {
          this._saveItem()
        }}
      />
    )
  }

  render() {
    const { isNameFocus, isAddressFocus } = this.state
    const { navigation } = this.props
    const { traslateTop } = this
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => { Keyboard.dismiss() }} >
          <View style={styles.container}>
            <Animated.View
              style={[
                styles.container,
                {
                  marginTop: traslateTop
                }
              ]}
            >
              <NavigationHeader
                style={{ marginTop: 20 + marginTop }}
                headerItem={{
                  title: 'Add New Address',
                  icon: null,
                  button: images.backButton
                }}
                action={() => {
                  navigation.goBack()
                }}
              />
              {this._renderNameField(isNameFocus)}
              {this._renderAddressField(isAddressFocus)}
              {this._scanQRCodeButton()}
            </Animated.View>
            {this._renderSaveButton()}
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppStyle.backgroundDarkMode
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Semibold',
    color: AppStyle.errorColor,
    alignSelf: 'flex-start',
    marginTop: 10
  }
})
