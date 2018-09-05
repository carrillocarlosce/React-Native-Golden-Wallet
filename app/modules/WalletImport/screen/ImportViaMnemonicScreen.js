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
  TouchableOpacity,
  Image,
  Clipboard,
  SafeAreaView
} from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react/native'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import Spinner from '../../../components/elements/Spinner'
import BottomButton from '../../../components/elements/BottomButton'
import LayoutUtils from '../../../commons/LayoutUtils'
import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'
import ImportMnemonicStore from '../stores/ImportMnemonicStore'
import ActionButton from '../../../components/elements/ActionButton'
import constant from '../../../commons/constant'
import MainStore from '../../../AppStores/MainStore'

const marginTop = LayoutUtils.getExtraTop()
const { width } = Dimensions.get('window')

@observer
export default class ImportViaMnemonicScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }

  constructor(props) {
    super(props)
    MainStore.importMnemonicStore = new ImportMnemonicStore()
    this.importMnemonicStore = MainStore.importMnemonicStore
    this.extraHeight = new Animated.Value(0)
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

  onChangeMnemonic = (text) => {
    this.importMnemonicStore.onChangeMnemonic(text)
  }

  onPaste = async () => {
    const content = await Clipboard.getString()
    if (content) {
      this.importMnemonicStore.onChangeMnemonic(content)
    }
  }

  returnData(codeScanned) {
    this.importMnemonicStore.onChangeMnemonic(codeScanned)
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
    this.importMnemonicStore.onChangeMnemonic('')
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

  _handleConfirm = () => {
    Keyboard.dismiss()
    const { navigation } = this.props

    this.importMnemonicStore.generateWallets()
      .then((res) => {
        navigation.navigate('ChooseAddressScreen')
      })
  }

  gotoScan = () => {
    const { navigation } = this.props
    setTimeout(() => {
      navigation.navigate('ScanQRCodeScreen', {
        title: 'Scan Mnemonic Phrase',
        marginTop,
        returnData: this.returnData.bind(this)
      })
    }, 300)
  }

  render() {
    const { navigation } = this.props
    const {
      mnemonic, loading, errorMnemonic, isReadyCreate
    } = this.importMnemonicStore

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
                  title: 'Add Mnemonic Phrases',
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
                  style={[
                    styles.textInput
                  ]}
                  onChangeText={this.onChangeMnemonic}
                  value={mnemonic}
                />
                {mnemonic === '' && this._renderPasteButton()}
                {mnemonic !== '' && this._renderClearButton()}
              </View>
              {errorMnemonic &&
                <Text style={styles.errorText}>{constant.INVALID_MNEMONIC}</Text>
              }
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
                  action={this.gotoScan}
                />
              </View>
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
    color: '#7F8286',
    fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
    fontSize: 18,
    paddingHorizontal: 27,
    paddingTop: 50,
    paddingBottom: 50,
    textAlignVertical: 'center'
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
    marginLeft: 20,
    marginTop: 10
  }
})
