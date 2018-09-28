import React, { Component } from 'react'
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
  TextInput,
  Clipboard,
  Animated,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native'
import { observer } from 'mobx-react'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import PropTypes from 'prop-types'
import Modal from 'react-native-modalbox'
import AppStyle from '../../../commons/AppStyle'
import images from '../../../commons/images'
import ChooseAddressScreen from './ChooseAddressScreen'
import Checker from '../../../Handler/Checker'
import MainStore from '../../../AppStores/MainStore'
import BottomButton from '../../../components/elements/BottomButton'
import LayoutUtils from '../../../commons/LayoutUtils'

const { width, height } = Dimensions.get('window')
const marginTop = Platform.OS === 'ios' ? getStatusBarHeight() : 20
const isIPX = LayoutUtils.getIsIPX()

@observer
export default class AdressInputScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object
  }
  static defaultProps = {
    navigation: {}
  }
  constructor(props) {
    super(props)
    this.state = {
      extraHeight: new Animated.Value(0)
    }
  }

  componentWillMount() {
    const show = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hide = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'
    this.keyboardDidShowListener = Keyboard.addListener(show, e => this._keyboardDidShow(e))
    this.keyboardDidHideListener = Keyboard.addListener(hide, e => this._keyboardDidHide(e))
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  onBack = () => {
    this.props.navigation.goBack()
  }

  onTouchDismissKeyboard = () => {
    Keyboard.dismiss()
  }

  _runExtraHeight(toValue) {
    Animated.timing(
      // Animate value over time
      this.state.extraHeight, // The value to drive
      {
        toValue: -toValue, // Animate to final value of 1
        duration: 250,
        useNativeDriver: true
      }
    ).start()
  }

  _keyboardDidShow(e) {
    if (this.addressInput.isFocused()) {
      if (e.endCoordinates.screenY < 437 + marginTop) {
        this._runExtraHeight(437 + marginTop - e.endCoordinates.screenY)
      }
    }
  }

  _keyboardDidHide(e) {
    this._runExtraHeight(0)
  }

  _renderPasteButton(addressInputStore) {
    return (
      <View style={{ position: 'absolute', right: 20, top: 0 }}>
        <TouchableOpacity
          onPress={this.actionPaste}
        >
          <View style={{ padding: 15 }}>
            <Text style={styles.pasteText}>Paste</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  actionPaste = async () => {
    const { addressInputStore } = MainStore.sendTransaction
    const content = await Clipboard.getString()
    if (content) {
      addressInputStore.setAddress(content)
      addressInputStore.validateAddress()
    }
  }

  handleConfirm = () => {
    MainStore.sendTransaction.goToConfirm()
  }

  gotoScan = () => {
    const { navigation } = this.props
    setTimeout(() => {
      navigation.navigate('ScanQRCodeScreen', {
        title: 'Scan QR Code',
        marginTop,
        returnData: this.returnData.bind(this)
      })
    }, 300)
  }

  clearText = () => {
    const { addressInputStore } = MainStore.sendTransaction
    addressInputStore.setAddress('')
    addressInputStore.setCount(0)
    addressInputStore.setDisableSend(true)
  }

  _renderClearButton() {
    return (
      <View style={{ position: 'absolute', right: 30, top: 15 }}>
        <TouchableOpacity onPress={this.clearText}>
          <Image source={images.iconCloseSearch} />
        </TouchableOpacity>
      </View>
    )
  }

  openScanQRCode = () => {
    Keyboard.dismiss()
    this.gotoScan()
  }

  openAddressModal = () => {
    Keyboard.dismiss()
    const { addressModal } = MainStore.sendTransaction.addressInputStore
    addressModal && addressModal.open()
  }

  _renderButton = () => {
    return (
      <View
        style={[styles.buttonContainer]}
      >
        <TouchableOpacity
          onPress={this.openScanQRCode}
        >
          <View
            style={styles.button}
          >
            <Text
              style={styles.buttonText}
            >
              Scan QR Code
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.line} />
        <TouchableOpacity
          onPress={this.openAddressModal}
        >
          <View
            style={styles.button}
          >
            <Text
              style={styles.buttonText}
            >
              Address Book
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  _renderAddressModal = (addressInputStore) => {
    return (
      <Modal
        style={styles.modalStyle}
        swipeToClose
        position="bottom"
        ref={(ref) => { MainStore.sendTransaction.addressInputStore.addressModal = ref }}
      >
        <View style={{ flex: 1 }}>
          <View
            style={styles.chooseAddressScreenStyle}
          />
          <ChooseAddressScreen
            onSelectedAddress={(address) => {
              addressInputStore.setAddress(address)
              addressInputStore.validateAddress()
            }}
          />
        </View>
      </Modal>
    )
  }

  returnData = (address) => {
    const { addressInputStore } = MainStore.sendTransaction
    const { selectedWallet } = MainStore.appState
    const resChecker = selectedWallet.type === 'ethereum'
      ? Checker.checkAddressQR(address)
      : Checker.checkAddressQRBTC(address)
    if (!resChecker || resChecker.length === 0) {
      addressInputStore.setAddress(address)
      addressInputStore.validateAddress()
    } else {
      addressInputStore.setAddress(resChecker[0])
      addressInputStore.checkSentTime()
      addressInputStore.setDisableSend(!resChecker)
    }
  }

  renderAlert = () => {
    const { addressInputStore } = MainStore.sendTransaction
    const {
      address,
      disableSend,
      countSentTime
    } = addressInputStore
    let transactionText = 'transactions'
    if (countSentTime == 1) {
      transactionText = 'transaction'
    }

    if (disableSend && address !== '') {
      return (
        <View
          style={styles.invalidContainer}
        >
          <Text style={styles.invalidText}>Invalid Address</Text>
        </View>
      )
    } else if (countSentTime && countSentTime > 0) {
      return (
        <View
          style={styles.invalidContainer}
        >
          <Text style={[styles.invalidText, { color: AppStyle.colorUp }]}>
            {`You have ${countSentTime} successful ${transactionText} with this address`}
          </Text>
        </View>
      )
    }
    return null
  }

  renderHeader = (value) => {
    return (
      <View
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.exit}
          onPress={this.onBack}
        >
          <Image style={styles.exitBtn} source={images.backButton} resizeMode="contain" />
        </TouchableOpacity>
        <View
          style={styles.headerTitle}
        >
          <Text style={styles.walletName}>Amount:</Text>
          <Text style={styles.headerBalance}>{value}</Text>
        </View>
      </View>
    )
  }

  render() {
    const { addressInputStore, amountStore } = MainStore.sendTransaction
    const {
      address,
      disableSend
    } = addressInputStore

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback
          onPress={this.onTouchDismissKeyboard}
        >
          <View
            style={styles.viewContainer}
          >
            <Animated.View
              style={[
                {
                  transform: [
                    { translateY: this.state.extraHeight }
                  ]
                }
              ]}
            >
              {this.renderHeader(amountStore.amountHeaderAddressInputScreen)}
              <View
                style={{
                  marginTop: 50
                }}
              >
                <TextInput
                  ref={ref => (this.addressInput = ref)}
                  underlineColorAndroid="transparent"
                  keyboardAppearance="dark"
                  autoCorrect={false}
                  multiline
                  style={[
                    styles.textInput
                  ]}
                  numberOfLines={4}
                  onChangeText={(text) => {
                    addressInputStore.setAddress(text)
                    addressInputStore.validateAddress()
                  }}
                  value={address}
                />
                {address === '' && this._renderPasteButton(addressInputStore)}
                {address !== '' && this._renderClearButton()}
              </View>
              {this.renderAlert()}
              {this._renderButton()}
            </Animated.View>
            <BottomButton
              onPress={this.handleConfirm}
              disable={disableSend}
              text="Confirm"
            />
          </View>
        </TouchableWithoutFeedback>
        {this._renderAddressModal(addressInputStore)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppStyle.backgroundColor
  },
  viewContainer: {
    flex: 1,
    paddingTop: marginTop,
    marginBottom: isIPX ? 30 : 0,
    backgroundColor: AppStyle.backgroundColor
  },
  header: {
    marginTop: 10,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0E1428',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15
  },
  walletName: {
    color: AppStyle.mainTextColor,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'normal'
  },
  headerBalance: {
    fontFamily: AppStyle.mainFontBold,
    fontSize: 18,
    color: AppStyle.mainColor,
    marginLeft: 4
  },
  exit: {
    position: 'absolute',
    left: 22,
    top: 0,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  exitBtn: {
    width: 20,
    height: 20
  },
  textInput: {
    height: 100,
    width: width - 40,
    backgroundColor: '#14192D',
    borderRadius: 5,
    color: AppStyle.secondaryTextColor,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'CourierNewBold',
    fontWeight: Platform.OS === 'ios' ? 'bold' : 'normal',
    fontSize: 16,
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 50,
    paddingLeft: 15,
    marginLeft: 20,
    marginRight: 20
  },
  pasteText: {
    color: AppStyle.mainColor,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 16
  },
  button: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContainer: {
    backgroundColor: '#14192D',
    borderRadius: 5,
    marginHorizontal: 20,
    marginTop: 10
  },
  buttonText: {
    color: '#4A90E2',
    fontSize: 14,
    fontFamily: 'OpenSans-Semibold'
  },
  line: {
    backgroundColor: AppStyle.borderLinesSetting,
    height: 1
  },
  invalidContainer: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10
  },
  invalidText: {
    color: '#d0021b',
    fontFamily: 'OpenSans-Semibold',
    fontSize: 14
  },
  modalStyle: {
    height: isIPX ? height - 150 : height - 80,
    zIndex: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
    backgroundColor: AppStyle.backgroundColor
  },
  chooseAddressScreenStyle: {
    alignSelf: 'center',
    height: 3,
    width: 45,
    borderRadius: 1.5,
    backgroundColor: AppStyle.secondaryTextColor,
    position: 'absolute',
    zIndex: 30,
    top: 10
  }
})
