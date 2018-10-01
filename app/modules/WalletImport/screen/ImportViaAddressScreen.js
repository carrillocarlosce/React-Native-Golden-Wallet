import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  SafeAreaView,
  Platform,
  TextInput,
  TouchableOpacity,
  Clipboard,
  Image
} from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react/native'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import ActionButton from '../../../components/elements/ActionButton'
import Spinner from '../../../components/elements/Spinner'
import BottomButton from '../../../components/elements/BottomButton'
import LayoutUtils from '../../../commons/LayoutUtils'
import NavStore from '../../../AppStores/NavStore'
import Checker from '../../../Handler/Checker'
import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'
import constant from '../../../commons/constant'
import ImportAddressStore from '../stores/ImportAddressStore'
import KeyboardView from '../../../components/elements/KeyboardView'
import TouchOutSideDismissKeyboard from '../../../components/elements/TouchOutSideDismissKeyboard'
import MainStore from '../../../AppStores/MainStore';

const { width } = Dimensions.get('window')
const marginTop = LayoutUtils.getExtraTop()

@observer
export default class ImportViaAddressScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }

  constructor(props) {
    super(props)
    this.extraHeight = new Animated.Value(0)
    MainStore.importAddressStore = new ImportAddressStore()
    this.importAddressStore = MainStore.importAddressStore
    const { coin } = props.navigation.state.params
    this.importAddressStore.setCoin(coin)
  }

  onPaste = async () => {
    const content = await Clipboard.getString()
    if (content) {
      this.onChangeAddress(content)
    }
  }

  _renderPasteButton() {
    return (
      <View style={{ position: 'absolute', right: 0 }}>
        <TouchableOpacity
          onPress={this.onPaste}
        >
          <View style={{ padding: 15 }}>
            <Text style={styles.pasteText}>Paste</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  clearText = () => {
    this.onChangeAddress('')
  }

  _renderClearButton() {
    return (
      <View style={{ position: 'absolute', right: 15, top: 15 }}>
        <TouchableOpacity onPress={this.clearText}>
          <Image source={images.iconCloseSearch} />
        </TouchableOpacity>
      </View>
    )
  }

  onChangeName = (text) => {
    this.importAddressStore.setTitle(text)
  }

  onChangeAddress = (text) => {
    this.importAddressStore.setAddress(text)
  }

  onFocusName = () => this.importAddressStore.setFocusField('name')
  onFocusAddress = () => this.importAddressStore.setFocusField('address')
  onBlurTextField = () => this.importAddressStore.setFocusField('')

  gotoScan = () => {
    setTimeout(() => {
      NavStore.pushToScreen('ScanQRCodeScreen', {
        title: 'Scan Address',
        marginTop,
        returnData: this.returnData.bind(this)
      })
    }, 300)
  }

  goBack = () => {
    NavStore.goBack()
  }

  returnData(codeScanned) {
    let address = codeScanned
    const { navigation } = this.props
    const { coin } = navigation.state.params
    // if (this.importAddressStore.title === '') {
    //   setTimeout(() => this.nameField.focus(), 250)
    // }
    const resChecker = Checker.checkAddressQR(codeScanned, coin)
    if (resChecker && resChecker.length > 0) {
      [address] = resChecker
    }
    this.importAddressStore.setAddress(address)
  }

  goToEnterName = () => {
    const { navigation } = this.props
    const { coin } = navigation.state.params
    NavStore.pushToScreen('EnterNameViaAddress', { coin })
  }

  render() {
    const {
      address, loading, errorAddress, isValidAddress
    } = this.importAddressStore
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TouchOutSideDismissKeyboard >
          <View style={styles.container}>
            <KeyboardView style={styles.container} >
              <NavigationHeader
                style={{ marginTop: marginTop + 20, width }}
                headerItem={{
                  title: 'Add Address',
                  icon: null,
                  button: images.backButton
                }}
                action={this.goBack}
              />
              <View style={{ marginTop: 25 }}>
                <TextInput
                  underlineColorAndroid="transparent"
                  keyboardAppearance="dark"
                  autoCorrect={false}
                  multiline
                  style={[
                    styles.textInput
                  ]}
                  onChangeText={this.onChangeAddress}
                  value={address}
                />
                {address === '' && this._renderPasteButton()}
                {address !== '' && this._renderClearButton()}
              </View>
              {errorAddress !== '' &&
                <Text style={styles.errorText}>{errorAddress}</Text>
              }
              <ActionButton
                style={{ height: 40, marginTop: 25 }}
                buttonItem={{
                  name: constant.SCAN_QR_CODE,
                  icon: images.iconQrCode,
                  background: '#121734'
                }}
                styleText={{ color: AppStyle.mainTextColor }}
                styleIcon={{ tintColor: AppStyle.mainTextColor }}
                action={this.gotoScan}
              />
            </KeyboardView>
            <BottomButton
              onPress={this.goToEnterName}
              disable={!isValidAddress}
            />
            {loading &&
              <Spinner />
            }
          </View>
        </TouchOutSideDismissKeyboard>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  titleText: {
    fontSize: 16,
    fontFamily: 'OpenSans-Semibold',
    color: 'white',
    alignSelf: 'flex-start',
    marginLeft: 20
  },
  textInput: {
    height: 182,
    width: width - 40,
    backgroundColor: '#14192D',
    borderRadius: 14,
    color: '#7F8286',
    fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
    fontSize: 18,
    paddingHorizontal: 27,
    paddingTop: 50,
    paddingBottom: 50,
    textAlignVertical: 'center'
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Semibold',
    color: AppStyle.errorColor,
    alignSelf: 'flex-start',
    marginTop: 10,
    marginLeft: 20
  },
  pasteText: {
    color: AppStyle.mainColor,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 16
  },
})
