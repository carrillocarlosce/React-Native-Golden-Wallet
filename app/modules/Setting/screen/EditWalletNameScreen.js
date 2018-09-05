import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
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
import NavStore from '../../../AppStores/NavStore'

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
    this.wallet = this.props.navigation ? this.props.navigation.state.params.wallet : {}
  }

  state = {
    allowShowErr: true
  }

  onChangeText = (text) => {
    this.manageWalletStore.setTitle(text)
  }

  handleSave = async () => {
    const { customTitle } = this.manageWalletStore
    this.wallet.title = customTitle
    this.setState({ allowShowErr: false })
    await this.manageWalletStore.editWallet(this.wallet)
    NotificationStore.addWallets()
    this.backToManageScreen()
  }

  backToManageScreen() {
    Keyboard.dismiss()
    NavStore.pushToScreen('ManageWalletScreen')
  }

  handleBack = () => {
    const { navigation } = this.props
    Keyboard.dismiss()
    navigation.goBack()
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
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
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
            {/* {loading &&
              <Spinner />
            } */}
          </View>
        </TouchableWithoutFeedback>
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
