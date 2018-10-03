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
import CreateWalletStore from '../CreateWalletStore'
import Spinner from '../../../components/elements/Spinner'
import constant from '../../../commons/constant'
import TouchOutSideDismissKeyboard from '../../../components/elements/TouchOutSideDismissKeyboard'

const { width } = Dimensions.get('window')
const marginTop = LayoutUtils.getExtraTopAndroid()

@observer
export default class EnterNameScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }

  constructor(props) {
    super(props)
    this.createWalletStore = new CreateWalletStore()
  }

  onChangeText = (text) => {
    this.createWalletStore.setTitle(text)
  }

  handleBack = () => {
    const { navigation } = this.props
    Keyboard.dismiss()
    navigation.goBack()
  }

  handleCreate = () => {
    const { navigation } = this.props
    const { coin } = navigation.state.params
    this.createWalletStore.handleCreateWallet(coin)
  }

  renderErrorField = () => {
    const { isShowError } = this.createWalletStore
    if (isShowError) {
      return <Text style={styles.errorText}>{constant.EXISTED_NAME}</Text>
    }
    return <View />
  }

  render() {
    const { title, loading, isReadCreate } = this.createWalletStore
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TouchOutSideDismissKeyboard >
          <View style={styles.container}>
            <NavigationHeader
              style={{ marginTop: marginTop + 20, width }}
              headerItem={{
                title: 'Type Your Wallet Name',
                icon: null,
                button: images.closeButton
              }}
              action={this.handleBack}
            />
            <InputWithAction
              autoFocus
              style={{ width: width - 40, marginTop: 25 }}
              value={title}
              onChangeText={this.onChangeText}
            />
            {this.renderErrorField()}
            <BottomButton
              disable={!isReadCreate}
              text="Create"
              onPress={this.handleCreate}
            />
            {loading &&
              <Spinner />
            }
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
