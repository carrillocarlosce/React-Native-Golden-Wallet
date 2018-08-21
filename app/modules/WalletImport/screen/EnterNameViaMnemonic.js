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
import Spinner from '../../../components/elements/Spinner'
import constant from '../../../commons/constant'
import MainStore from '../../../AppStores/MainStore'

const { width } = Dimensions.get('window')
const marginTop = LayoutUtils.getExtraTop()

@observer
export default class EnterNameViaMnemonic extends Component {
  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }

  constructor(props) {
    super(props)
    this.importMnemonicStore = MainStore.importMnemonicStore
  }

  onChangeText = (text) => {
    this.importMnemonicStore.setTitle(text)
  }

  handleBack = () => {
    const { navigation } = this.props
    Keyboard.dismiss()
    navigation.goBack()
  }

  handleCreate = () => {
    this.importMnemonicStore.unlockWallet()
  }

  renderErrorField = () => {
    const { titleIsExisted } = this.importMnemonicStore
    if (titleIsExisted) {
      return <Text style={styles.errorText}>{constant.EXISTED_NAME}</Text>
    }
    return <View />
  }

  render() {
    const { title, loading, isReadyUnlock } = this.importMnemonicStore
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
          <View style={styles.container}>
            <NavigationHeader
              style={{ marginTop: marginTop + 20, width }}
              headerItem={{
                title: 'Type Your Wallet Name',
                icon: null,
                button: images.backButton
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
              disable={!isReadyUnlock}
              text="Done"
              onPress={this.handleCreate}
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
