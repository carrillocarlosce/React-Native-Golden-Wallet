import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Animated,
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
import ManageWalletStore from '../stores/ManageWalletStore'
import constant from '../../../commons/constant'
import AppStyle from '../../../commons/AppStyle'
import InputWithAction from '../../../components/elements/InputWithActionItem'
import commonStyle from '../../../commons/commonStyles'
import NavStore from '../../../AppStores/NavStore'
import TouchOutSideDismissKeyboard from '../../../components/elements/TouchOutSideDismissKeyboard'

const marginTop = LayoutUtils.getExtraTop()
const { width } = Dimensions.get('window')

@observer
export default class AddPrivateKeyScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }

  constructor(props) {
    super(props)
    this.manageWalletStore = new ManageWalletStore()
    this.wallet = this.props.navigation ? this.props.navigation.state.params.wallet : {}
    this.manageWalletStore.selectedWallet = this.wallet
  }

  onChangePrivKey = (text) => {
    this.manageWalletStore.setPrivateKey(text)
    const { isErrorPrivateKey } = this.manageWalletStore
    if (isErrorPrivateKey) {
      this.privKeyField.shake()
    }
  }

  onBack = () => { NavStore.goBack() }

  returnData(codeScanned) {
    this.manageWalletStore.setPrivateKey(codeScanned)
  }

  _onPaste = async () => {
    const content = await Clipboard.getString()
    if (content) {
      this.manageWalletStore.setPrivateKey(content)
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
    this.manageWalletStore.setPrivateKey('')
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
    this.manageWalletStore.implementPrivateKey(this.wallet, this.props.navigation.state.params.onAdded)
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
      privKey, isErrorPrivateKey, isReadyCreate
    } = this.manageWalletStore
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TouchOutSideDismissKeyboard >
          <View style={styles.container}>
            <Animated.View
              style={[styles.container]}
            >
              <NavigationHeader
                style={{ marginTop: marginTop + 20, width }}
                headerItem={{
                  title: 'Add Private Key',
                  icon: null,
                  button: images.backButton
                }}
                action={this.onBack}
              />
              <InputWithAction
                ref={(ref) => { this.privKeyField = ref }}
                style={{ width: width - 40, marginTop: 25 }}
                onChangeText={this.onChangePrivKey}
                needPasteButton
                styleTextInput={commonStyle.fontAddress}
                value={privKey}
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
    marginTop: 10,
    marginLeft: 20
  }
})
