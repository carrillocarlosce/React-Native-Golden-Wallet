import React, { Component } from 'react'
import {
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native'
import PropTypes from 'prop-types'

export default class TouchOutSideDismissKeyboard extends Component {
  static propTypes = {
    children: PropTypes.object
  }

  static defaultProps = {
    children: {}
  }

  onOutSidePress = () => Keyboard.dismiss()

  render() {
    const { children } = this.props
    return (
      <TouchableWithoutFeedback onPress={this.onOutSidePress}>
        {children}
      </TouchableWithoutFeedback>
    )
  }
}
