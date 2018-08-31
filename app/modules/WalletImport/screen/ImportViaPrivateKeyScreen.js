import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Platform,
  Keyboard,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Clipboard,
  Image,
  SafeAreaView
} from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react/native'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import ActionButton from '../../../components/elements/ActionButton'
import BottomButton from '../../../components/elements/BottomButton'
import LayoutUtils from '../../../commons/LayoutUtils'
import images from '../../../commons/images'
import NavStore from '../../../AppStores/NavStore'
import Checker from '../../../Handler/Checker'
import constant from '../../../commons/constant'
import AppStyle from '../../../commons/AppStyle'
import Spinner from '../../../components/elements/Spinner'
import ImportPrivateKeyStore from '../stores/ImportPrivateKeyStore'
import InputWithAction from '../../../components/elements/InputWithActionItem'
import commonStyle from '../../../commons/commonStyles'

const marginTop = LayoutUtils.getExtraTop()
const { width } = Dimensions.get('window')

@observer
export default class ImportViaPrivateKeyScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }

  constructor(props) {
    super(props)
    this.extraHeight = new Animated.Value(0)
    this.importPrivateKeyStore = new ImportPrivateKeyStore()
    this.state = {
      isNameFocus: false,
      isPrivateKeyFocus: false
    }
  }

  componentWillMount() {
    const show = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hide = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'
    this.keyboardDidShowListener = Keyboard.addListener(show, e => this._keyboardDidShow(e))
    this.keyboardDidHideListener = Keyboard.addListener(hide, e => this._keyboardDidHide(e))
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  onChangePrivKey = (text) => {
    this.importPrivateKeyStore.setPrivateKey(text)
    const { isErrorPrivateKey } = this.importPrivateKeyStore
    if (isErrorPrivateKey) {
      this.privKeyField.shake()
    }
  }

  onChangeName = (text) => {
    this.importPrivateKeyStore.setTitle(text)
  }

  _runExtraHeight(toValue) {
    Animated.timing(
      // Animate value over time
      this.extraHeight, // The value to drive
      {
        toValue: -toValue, // Animate to final value of 1
        duration: 250
      }
    ).start()
  }

  _keyboardDidShow(e) {
    if (e.endCoordinates.screenY < 437 + marginTop + 15) {
      this._runExtraHeight(437 + marginTop - e.endCoordinates.screenY + 15)
    }
  }

  _keyboardDidHide(e) {
    this._runExtraHeight(0)
  }

  returnData(codeScanned) {
    this.importPrivateKeyStore.setPrivateKey(codeScanned)
  }

  _onPaste = async () => {
    const content = await Clipboard.getString()
    if (content) {
      this.importPrivateKeyStore.setPrivateKey(content)
    }
  }

  _renderPasteButton() {
    return (
      <View style={{ position: 'absolute', right: 0 }}>
        <TouchableOpacity
          onPress={this._onPaste}
        >
          <View style={{ padding: 15 }}>
            <Text style={styles.pasteText}>Paste</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  clearText = () => {
    this.importPrivateKeyStore.setPrivateKey('')
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

  _handleConfirm = async () => {
    const { privateKey } = this.importPrivateKeyStore
    if (privateKey === '') {
      NavStore.popupCustom.show('Private key can not be empty')
      return
    }
    if (!Checker.checkPrivateKey(privateKey)) {
      NavStore.popupCustom.show('Invalid private key')
      return
    }
    this.importPrivateKeyStore.create()
  }

  gotoScan = () => {
    const { navigation } = this.props
    setTimeout(() => {
      navigation.navigate('ScanQRCodeScreen', {
        title: 'Scan Private Key',
        marginTop,
        returnData: this.returnData.bind(this)
      })
    }, 300)
  }

  render() {
    const { navigation } = this.props
    const { isNameFocus, isPrivateKeyFocus } = this.state
    console.log(isNameFocus)
    const {
      privateKey, loading, title, isErrorTitle, isErrorPrivateKey, isReadyCreate
    } = this.importPrivateKeyStore
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
          <View style={styles.container}>
            <Animated.View
              style={[styles.container, {
                marginTop: this.extraHeight
              }]}
            >
              <NavigationHeader
                style={{ marginTop: marginTop + 20, width }}
                headerItem={{
                  title: 'Add Private Key',
                  icon: null,
                  button: images.backButton
                }}
                action={() => {
                  navigation.goBack()
                }}
              />
              <Text style={[styles.titleText, { marginTop: 15, color: isNameFocus ? AppStyle.mainColor : 'white' }]}>Name</Text>
              <InputWithAction
                ref={(ref) => { this.nameField = ref }}
                style={{ width: width - 40, marginTop: 10 }}
                value={title}
                onFocus={() => this.setState({ isNameFocus: true })}
                onBlur={() => this.setState({ isNameFocus: false })}
                onChangeText={this.onChangeName}
              />
              {isErrorTitle &&
                <Text style={styles.errorText}>{constant.EXISTED_NAME}</Text>
              }
              <Text style={[styles.titleText, { marginTop: 20, color: isPrivateKeyFocus ? AppStyle.mainColor : 'white' }]}>Private Key</Text>
              <InputWithAction
                ref={(ref) => { this.privKeyField = ref }}
                style={{ width: width - 40, marginTop: 10 }}
                onChangeText={this.onChangePrivKey}
                needPasteButton
                styleTextInput={commonStyle.fontAddress}
                value={privateKey}
                onFocus={() => this.setState({ isPrivateKeyFocus: true })}
                onBlur={() => this.setState({ isPrivateKeyFocus: false })}
              />
              {isErrorPrivateKey &&
                <Text style={styles.errorText}>{constant.INVALID_PRIVATE_KEY}</Text>
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
            </Animated.View>
            <BottomButton
              disable={!isReadyCreate}
              onPress={this._handleConfirm}
            />
            {loading &&
              <Spinner />
            }
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1
  },
  pasteText: {
    color: AppStyle.mainColor,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 16
  },
  titleText: {
    fontSize: 16,
    fontFamily: 'OpenSans-Semibold',
    color: 'white',
    alignSelf: 'flex-start',
    marginLeft: 20
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Semibold',
    color: AppStyle.errorColor,
    alignSelf: 'flex-start',
    marginTop: 10,
    marginLeft: 20
  }
})
