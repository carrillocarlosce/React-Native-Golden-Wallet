import React, { Component } from 'react'
import {
  Animated,
  StyleSheet,
  Dimensions,
  Text
} from 'react-native'
// import PropTypes from 'prop-types'
import HapticHandler from '../../Handler/HapticHandler'
import LayoutUtils from '../../commons/LayoutUtils'

const { width } = Dimensions.get('window')
const { heightNotif } = LayoutUtils
export default class CustomToastTop extends Component {
  constructor(props) {
    super(props)
    this.offsetToast = new Animated.Value(-heightNotif)
    this.state = {
      content: '',
      styleText: {},
      style: {}
    }
  }

  showToast(content, style = {}, styleText = {}) {
    this.setState({
      content,
      style,
      styleText
    })
    setTimeout(() => HapticHandler.ImpactLight(), 100)
    Animated.timing(this.offsetToast, {
      toValue: 0,
      duration: 250
    }).start()
    setTimeout(() => this.hideToast(), 2500)
  }

  hideToast() {
    Animated.timing(this.offsetToast, {
      toValue: -heightNotif,
      duration: 250
    }).start()
  }

  render() {
    const { content, style, styleText } = this.state
    return (
      <Animated.View
        style={[styles.container, {
          transform: [
            {
              translateY: this.offsetToast
            }
          ]
        }, style]}
      >
        <Text style={[styles.copyText, styleText]}>{content}</Text>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width,
    height: heightNotif,
    backgroundColor: '#212637',
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'absolute'
  },
  copyText: {
    fontSize: 16,
    fontFamily: 'OpenSans-Bold',
    color: '#4A90E2',
    marginBottom: 10
  }
})
