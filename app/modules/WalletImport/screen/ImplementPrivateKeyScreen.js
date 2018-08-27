import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Platform,
  TextInput,
  Keyboard,
  Animated,
  TouchableWithoutFeedback,
  Clipboard,
  TouchableOpacity,
  Image,
  SafeAreaView
} from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react/native'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import constant from '../../../commons/constant'
import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'
import ActionButton from '../../../components/elements/ActionButton'
import LayoutUtils from '../../../commons/LayoutUtils'
import BottomButton from '../../../components/elements/BottomButton'
import MainStore from '../../../AppStores/MainStore'
import ImplementPrivateKeyStore from '../stores/ImplementPrivateKeyStore'

const marginTop = LayoutUtils.getExtraTop()
const { width } = Dimensions.get('window')

@observer
export default class ImplementPrivateKeyScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }

  constructor(props) {
    super(props)
    this.extraHeight = new Animated.Value(0)
    this.implementPrivateKeyStore = new ImplementPrivateKeyStore()
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

  onChangePrivateKey = (text) => {
    this.implementPrivateKeyStore.setPrivateKey(text)
  }

  onPaste = async () => {
    const content = await Clipboard.getString()
    if (content) {
      this.implementPrivateKeyStore.setPrivateKey(content)
    }
  }

  get selectedWallet() {
    const { index } = this.props.navigation.state.params
    return MainStore.appState.wallets[index]
  }

  _runExtraHeight(toValue) {
    Animated.timing(
      // Animate value over time
      this.extraHeight, // The value to drive
      {
        toValue: -toValue, // Animate to final value of 1
        duration: 250,
        useNativeDriver: true
      }
    ).start()
  }

  _keyboardDidShow(e) {
    if (e.endCoordinates.screenY < 437 + marginTop) {
      this._runExtraHeight(437 + marginTop - e.endCoordinates.screenY)
    }
  }

  _keyboardDidHide(e) {
    this._runExtraHeight(0)
  }

  returnData(codeScanned) {
    this.implementPrivateKeyStore.setPrivateKey(codeScanned)
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
    this.implementPrivateKeyStore.setPrivateKey('')
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
    this.implementPrivateKeyStore.implementPrivateKey(this.selectedWallet)
  }

  render() {
    const { navigation } = this.props
    const { privateKey, isReadyCreate, isErrorPrivateKey } = this.implementPrivateKeyStore
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
          <View style={styles.container}>
            <Animated.View
              style={[styles.container, {
                transform: [
                  { translateY: this.extraHeight }
                ]
              }]}
            >
              <NavigationHeader
                style={{ marginTop: marginTop + 20, width }}
                headerItem={{
                  title: 'Enter Your Private Key',
                  icon: null,
                  button: images.backButton
                }}
                action={() => {
                  navigation.goBack()
                }}
              />
              <View style={{ marginTop: 25 }}>
                <TextInput
                  underlineColorAndroid="transparent"
                  keyboardAppearance="dark"
                  autoCorrect={false}
                  multiline
                  numberOfLines={4}
                  style={[
                    styles.textInput
                  ]}
                  onChangeText={this.onChangePrivateKey}
                  value={privateKey}
                />
                {privateKey === '' && this._renderPasteButton()}
                {privateKey !== '' && this._renderClearButton()}
                {isErrorPrivateKey &&
                  <Text style={styles.errorText}>{constant.INVALID_PRIVATE_KEY}</Text>
                }
              </View>
              <View style={styles.actionButton}>
                <ActionButton
                  style={{ height: 40, paddingHorizontal: 17 }}
                  buttonItem={{
                    name: constant.SCAN_QR_CODE,
                    icon: images.iconQrCode,
                    background: '#121734'
                  }}
                  styleText={{ color: AppStyle.mainTextColor }}
                  styleIcon={{ tintColor: AppStyle.mainTextColor }}
                  action={() => {
                    setTimeout(() => {
                      navigation.navigate('ScanQRCodeScreen', {
                        title: 'Scan Private Key',
                        marginTop,
                        returnData: this.returnData.bind(this)
                      })
                    }, 300)
                  }}
                />
              </View>
            </Animated.View>
            <BottomButton
              onPress={this._handleConfirm}
              disable={!isReadyCreate}
            />
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1
  },
  textInput: {
    height: 182,
    width: width - 40,
    backgroundColor: '#14192D',
    borderRadius: 14,
    color: AppStyle.secondaryTextColor,
    fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
    fontSize: 18,
    paddingHorizontal: 27,
    paddingTop: 50,
    paddingBottom: 50,
    textAlign: 'center'
  },
  actionButton: {
    width,
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20
  },
  pasteText: {
    color: AppStyle.mainColor,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 16
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Semibold',
    color: AppStyle.errorColor,
    alignSelf: 'flex-start',
    marginTop: 10
  }
})
