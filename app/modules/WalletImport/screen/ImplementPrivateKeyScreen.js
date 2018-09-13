import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Platform,
  TextInput,
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
import KeyboardView from '../../../components/elements/KeyboardView'
import TouchOutSideDismissKeyboard from '../../../components/elements/TouchOutSideDismissKeyboard'
import NavStore from '../../../AppStores/NavStore'

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
    this.implementPrivateKeyStore = new ImplementPrivateKeyStore()
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

  onBack = () => {
    NavStore.goBack()
  }

  get selectedWallet() {
    const { index } = this.props.navigation.state.params
    return MainStore.appState.wallets[index]
  }

  gotoScanQRCode = () => {
    setTimeout(() => {
      NavStore.pushToScreen('ScanQRCodeScreen', {
        title: 'Scan Private Key',
        marginTop,
        returnData: this.returnData.bind(this)
      })
    }, 300)
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
    const { privateKey, isReadyCreate, isErrorPrivateKey } = this.implementPrivateKeyStore
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TouchOutSideDismissKeyboard >
          <View style={styles.container}>
            <KeyboardView style={styles.container}>
              <NavigationHeader
                style={{ marginTop: marginTop + 20, width }}
                headerItem={{
                  title: 'Enter Your Private Key',
                  icon: null,
                  button: images.backButton
                }}
                action={this.onBack}
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
                  action={this.gotoScanQRCode}
                />
              </View>
            </KeyboardView>
            <BottomButton
              onPress={this._handleConfirm}
              disable={!isReadyCreate}
            />
          </View>
        </TouchOutSideDismissKeyboard>
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
