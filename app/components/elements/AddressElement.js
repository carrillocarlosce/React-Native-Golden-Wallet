import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Platform
} from 'react-native'
import PropTypes from 'prop-types'
import AppStyle from '../../commons/AppStyle';

export default class AddressElement extends PureComponent {
  static propTypes = {
    address: PropTypes.string,
    style: PropTypes.object,
    textStyle: PropTypes.object
  }

  static defaultProps = {
    address: '0x0acd20d49f31cf456b585cec92889970fda9bc8b',
    style: {},
    textStyle: {}
  }

  render() {
    const { address, style, textStyle } = this.props
    const top = address.slice(0, 4)
    const mid = address.slice(5, address.length - 5)
    const bot = address.slice(address.length - 4, address.length)
    return (
      <View style={[styles.container, style]}>
        <Text
          style={[styles.text, textStyle]}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {top}
          <Text style={[styles.text, textStyle, { color: AppStyle.secondaryTextColor }]}>
            {mid}
          </Text>
          {bot}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: 160
  },
  text: {
    fontSize: 14,
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'CourierNewBold',
    fontWeight: 'bold'
  }
})
