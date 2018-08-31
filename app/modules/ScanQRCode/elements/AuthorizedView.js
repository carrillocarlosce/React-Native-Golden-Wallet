import React, { PureComponent } from 'react'
import {
  Text,
  View,
  StyleSheet,
  Image
} from 'react-native'
import PropsType from 'prop-types'
import AppStyle from '../../../commons/AppStyle'
import images from '../../../commons/images'
import constants from '../../../commons/constant'

export default class AuthorizedView extends PureComponent {
  static propTypes = {
    imageStyle: PropsType.object,
    textStyle: PropsType.object
  }

  static defaultProps = {
    imageStyle: {},
    textStyle: {}
  }
  render() {
    const {
      imageStyle = {},
      textStyle = {}
    } = this.props

    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Image
          style={imageStyle}
          source={images.scanFrame}
        />
        <Text
          style={[styles.description, textStyle]}
        >
          {constants.SCAN_QR_FRAME}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  description: {
    fontFamily: 'OpenSans-Light',
    fontSize: 14,
    color: AppStyle.mainTextColor
  }
})
