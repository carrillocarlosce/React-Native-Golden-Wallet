import React, { Component } from 'react'
import { observer } from 'mobx-react/native'
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native'
import PropTypes from 'prop-types'
import images from '../../../commons/images'
import MainStore from '../../../AppStores/MainStore'
import AppStyle from '../../../commons/AppStyle'

@observer
export default class HomeSendButton extends Component {
  static propTypes = {
    action: PropTypes.func.isRequired
  }

  render() {
    const { action } = this.props
    const { isShowSendButton } = MainStore.appState

    if (!isShowSendButton) {
      return <View />
    }
    return (
      <TouchableOpacity onPress={action}>
        <View style={styles.btnSend}>
          <Image
            source={images.iconSend}
          />
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  btnSend: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppStyle.backgroundDarkBlue,
    borderRadius: 35
  }
})
