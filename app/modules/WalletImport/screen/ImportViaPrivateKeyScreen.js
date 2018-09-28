import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  Clipboard,
  Image,
  SafeAreaView,
  Platform,
  TextInput
} from 'react-native'
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
import KeyboardView from '../../../components/elements/KeyboardView'
import TouchOutSideDismissKeyboard from '../../../components/elements/TouchOutSideDismissKeyboard'
import MainStore from '../../../AppStores/MainStore'

const marginTop = LayoutUtils.getExtraTop()
const { width } = Dimensions.get('window')

@observer
export default class ImportViaPrivateKeyScreen extends Component {
  constructor(props) {
    super(props)
    MainStore.importPrivateKeyStore = new ImportPrivateKeyStore()
    this.importPrivateKeyStore = MainStore.importPrivateKeyStore
  }

  onBack = () => {
    NavStore.goBack()
  }

  onChangePrivKey = (text) => {
    this.importPrivateKeyStore.setPrivateKey(text)
    const { isErrorPrivateKey } = this.importPrivateKeyStore
    // if (isErrorPrivateKey) {
    //   // this.privKeyField.shake()
    // }
  }

  onChangeName = (text) => {
    this.importPrivateKeyStore.setTitle(text)
  }

  onFocusName = () => this.importPrivateKeyStore.setFocusField('name')
  onFocusPrivateKey = () => this.importPrivateKeyStore.setFocusField('private_key')
  onBlurTextField = () => this.importPrivateKeyStore.setFocusField('')

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



  goToEnterName = () => {
    const { navigation } = this.props
    const { coin } = navigation.state.params

    NavStore.pushToScreen('EnterNameViaPrivateKey', { coin })
  }

  gotoScan = () => {
    setTimeout(() => {
      NavStore.pushToScreen('ScanQRCodeScreen', {
        title: 'Scan Private Key',
        marginTop,
        returnData: this.returnData.bind(this)
      })
    }, 300)
  }

  render() {
    const {
      privateKey, loading, isErrorPrivateKey, isValidPrivateKey
    } = this.importPrivateKeyStore
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TouchOutSideDismissKeyboard>
          <View style={styles.container}>
            <KeyboardView style={styles.container}>
              <NavigationHeader
                style={{ marginTop: marginTop + 20, width }}
                headerItem={{
                  title: 'Add Private Key',
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
                  style={[
                    styles.textInput
                  ]}
                  onChangeText={this.onChangePrivKey}
                  value={privateKey}
                />
                {privateKey === '' && this._renderPasteButton()}
                {privateKey !== '' && this._renderClearButton()}
              </View>
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
            </KeyboardView>
            <BottomButton
              disable={!isValidPrivateKey}
              onPress={this.goToEnterName}
            />
            {loading &&
              <Spinner />
            }
          </View>
        </TouchOutSideDismissKeyboard>
      </SafeAreaView >
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
