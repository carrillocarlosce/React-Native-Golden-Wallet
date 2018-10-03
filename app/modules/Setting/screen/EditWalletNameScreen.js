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
import NotificationStore from '../../../AppStores/stores/Notification'
import ManageWalletStore from '../stores/ManageWalletStore'
import TouchOutSideDismissKeyboard from '../../../components/elements/TouchOutSideDismissKeyboard'
import MixpanelHandler from '../../../Handler/MixpanelHandler'
import MainStore from '../../../AppStores/MainStore'

const { width } = Dimensions.get('window')
const marginTop = LayoutUtils.getExtraTop()

@observer
export default class EditWalletNameScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }

  constructor(props) {
    super(props)
    this.manageWalletStore = new ManageWalletStore()
    const { navigation } = this.props
    this.wallet = navigation ? navigation.state.params.wallet : {}
  }

  state = {
    allowShowErr: true
  }

  componentDidMount() {
    this.manageWalletStore.setSelectedWallet(this.wallet)
    const title = this.wallet.title ? this.wallet.title : ''
    this.manageWalletStore.setTitle(title)
  }

  onChangeText = (text) => {
    this.manageWalletStore.setTitle(text)
  }

  handleSave = async () => {
    const { customTitle } = this.manageWalletStore
    this.wallet.title = customTitle
    this.setState({ allowShowErr: false })
    await this.manageWalletStore.editWallet(this.wallet)
    MainStore.appState.mixpanleHandler.track(MixpanelHandler.eventName.ACTION_MANAGE_WALLET_EDIT)
    NotificationStore.addWallets()
    this.hideKeyboard()
    this.props.navigation.state.params.onEdited()
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
    const { isShowError } = this.manageWalletStore
    if (isShowError && this.state.allowShowErr) {
      return <Text style={styles.errorText}>{constant.EXISTED_WALLET_NAME}</Text>
    }
    return <View />
  }

  render() {
    const { customTitle, isAllowedToSave } = this.manageWalletStore
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TouchOutSideDismissKeyboard >
          <View style={styles.container}>
            <NavigationHeader
              style={{ marginTop: marginTop + 20, width }}
              headerItem={{
                title: 'Edit Wallet Name',
                icon: null,
                button: images.backButton
              }}
              action={this.handleBack}
            />
            <InputWithAction
              autoFocus
              style={{ width: width - 40, marginTop: 25 }}
              value={customTitle}
              onChangeText={this.onChangeText}
            />
            {this.renderErrorField()}
            <BottomButton
              disable={!isAllowedToSave}
              text="Save"
              onPress={this.handleSave}
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
  }
})
