import React, { Component } from 'react'
import {
  Animated,
  Platform,
  Keyboard
} from 'react-native'
import PropTypes from 'prop-types'
import LayoutUtils from '../../commons/LayoutUtils'

const marginTop = LayoutUtils.getExtraTop()

export default class KeyboardView extends Component {
  static propTypes = {
    children: PropTypes.array,
    style: PropTypes.number,
    extraTop: PropTypes.number
  }

  static defaultProps = {
    children: [],
    style: 0,
    extraTop: 437
  }

  constructor(props) {
    super(props)
    this.extraHeight = new Animated.Value(0)
  }

  componentWillMount() {
    const show = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hide = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'
    this.keyboardDidShowListener = Keyboard.addListener(show, e => this._keyboardDidShow(e))
    this.keyboardDidHideListener = Keyboard.addListener(hide, e => this._keyboardDidHide(e))
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  get animatedStyle() {
    if (Platform.OS === 'ios') {
      return {
        transform: [
          { translateY: this.extraHeight }
        ]
      }
    }
    return {
      marginTop: this.extraHeight
    }
  }

  _runExtraHeight(toValue) {
    Animated.timing(
      // Animate value over time
      this.extraHeight, // The value to drive
      {
        toValue: -toValue, // Animate to final value of 1
        duration: 250
      }
    ).start()
  }

  _keyboardDidShow(e) {
    const { extraTop } = this.props
    if (e.endCoordinates.screenY < extraTop + marginTop + 15) {
      this._runExtraHeight(extraTop + marginTop - e.endCoordinates.screenY + 15)
    }
  }

  _keyboardDidHide(e) {
    this._runExtraHeight(0)
  }

  render() {
    const { children, style } = this.props
    const { animatedStyle } = this
    return (
      <Animated.View
        style={[style, animatedStyle]}
      >
        {children}
      </Animated.View>
    )
  }
}
