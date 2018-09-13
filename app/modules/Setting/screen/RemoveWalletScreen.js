import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  Dimensions,
  Text
} from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react/native'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import InputWithAction from '../../../components/elements/InputWithActionItem'
import BottomButton from '../../../components/elements/BottomButton'
import LayoutUtils from '../../../commons/LayoutUtils'
import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'
import constant from '../../../commons/constant'
import MainStore from '../../../AppStores/MainStore'
import ManageWalletStore from '../stores/ManageWalletStore'
import NavStore from '../../../AppStores/NavStore'
import TouchOutSideDismissKeyboard from '../../../components/elements/TouchOutSideDismissKeyboard'

const { width } = Dimensions.get('window')
const marginTop = LayoutUtils.getExtraTop()

@observer
export default class RemoveWalletScreen extends Component {
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

  state = {
    allowShowErr: true
  }

  onChangeText = (text) => {
    this.manageWalletStore.setTitle(text)
  }

  handleRemove = async () => {
    const { wallets, selectedWallet } = MainStore.appState
    const index = wallets.indexOf(selectedWallet)
    if (index === wallets.length - 1) {
      MainStore.appState.setSelectedWallet(null)
    }
    this.setState({ allowShowErr: false })
    await this.manageWalletStore.removeWallet(this.wallet)
    if (MainStore.appState.wallets.length === 0) {
      MainStore.appState.setSelectedWallet(null)
    }
    this.backToManageScreen()
  }

  backToManageScreen() {
    this.hideKeyboard()
    NavStore.pushToScreen('ManageWalletScreen')
  }

  handleBack = () => {
    const { navigation } = this.props
    this.hideKeyboard()
    navigation.goBack()
  }

  hideKeyboard = () => {
    Keyboard.dismiss()
  }

  renderErrorField = () => {
    const { isShowErrorRemove } = this.manageWalletStore
    if (isShowErrorRemove && this.state.allowShowErr) {
      return <Text style={styles.errorText}>{constant.NO_WALLET_NAME_FOUND}</Text>
    }
    return <View />
  }

  render() {
    const { customTitle, isAllowedToRemove } = this.manageWalletStore
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TouchOutSideDismissKeyboard >
          <View style={styles.container}>
            <NavigationHeader
              style={{ marginTop: marginTop + 20, width }}
              headerItem={{
                title: 'Remove Wallet',
                icon: null,
                button: images.backButton
              }}
              action={this.handleBack}
            />
            <Text style={styles.description}>{constant.REMOVE_WALLET_DESCRIPTION}</Text>
            <InputWithAction
              autoFocus
              style={{ width: width - 40, marginTop: 25 }}
              value={customTitle}
              onChangeText={this.onChangeText}
            />
            {this.renderErrorField()}
            <BottomButton
              disable={!isAllowedToRemove}
              text="Remove"
              onPress={this.handleRemove}
            />
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
  errorText: {
    color: AppStyle.errorColor,
    fontSize: 14,
    fontFamily: 'OpenSans-Semibold',
    marginTop: 10,
    marginLeft: 20,
    alignSelf: 'flex-start'
  },
  description: {
    marginTop: 15,
    color: AppStyle.secondaryTextColor,
    fontSize: 16,
    fontFamily: 'OpenSans-Semibold'
  }
})
