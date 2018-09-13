import React, { PureComponent } from 'react'
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback
} from 'react-native'
import PropsType from 'prop-types'
import AppStyle from '../../../commons/AppStyle'
import constants from '../../../commons/constant'
import images from '../../../commons/images'

export default class UnAuthorizedView extends PureComponent {
  static propTypes = {
    onPress: PropsType.func
  }

  static defaultProps = {
    onPress: () => { }
  }
  render() {
    const {
      onPress = () => { }
    } = this.props

    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: AppStyle.colorBlack
        }}
      >
        <TouchableWithoutFeedback
          onPress={onPress}
        >
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Image
              source={images.imgScanFrame}
            />
            <Text
              style={styles.accessCamera}
            >
              Allow Camera Access
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <Text
          style={styles.description}
        >
          {constants.SCAN_QR_FRAME}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  accessCamera: {
    color: AppStyle.blueActionColor,
    position: 'absolute',
    fontFamily: 'OpenSans-Semibold',
    fontSize: 18
  },
  description: {
    marginTop: 25,
    fontFamily: 'OpenSans-Light',
    fontSize: 14,
    color: AppStyle.mainTextColor
  }
})
