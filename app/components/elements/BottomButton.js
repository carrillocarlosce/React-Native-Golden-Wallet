import React, { Component } from 'react'
import {
  Animated,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  Platform
} from 'react-native'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
import LayoutUtils from '../../commons/LayoutUtils'
import AppStyle from '../../commons/AppStyle'
import constant from '../../commons/constant'

const { height } = Dimensions.get('window')
const isIPX = height === 812
const extraBottom = LayoutUtils.getExtraBottom()

export default class BottomButton extends Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    text: PropTypes.string,
    disable: PropTypes.bool
  }

  static defaultProps = {
    text: constant.DONE,
    disable: false
  }

  state = {
    bottom: new Animated.Value(20 + extraBottom),
    marginVertical: new Animated.Value(20),
    borderRadius: new Animated.Value(5)
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

  onPress = debounce(() => {
    const { onPress } = this.props
    Keyboard.dismiss()
    onPress()
  }, 250)

  _runKeyboardAnim(toValue) {
    const duration = Platform.OS === 'ios' ? 250 : 0
    Animated.parallel([
      Animated.timing(
        this.state.bottom,
        {
          toValue,
          duration
        }
      ),
      Animated.timing(
        this.state.marginVertical,
        {
          toValue: toValue === 20 + extraBottom ? 20 : 0,
          duration
        }
      ),
      Animated.timing(
        this.state.borderRadius,
        {
          toValue: toValue === 20 + extraBottom ? 5 : 0,
          duration
        }
      )
    ]).start()
  }

  _keyboardDidShow(e) {
    let value = Platform.OS === 'ios' ? e.endCoordinates.height + extraBottom : 0

    if (isIPX) {
      value -= 34
    }
    this._runKeyboardAnim(value)
  }

  _keyboardDidHide(e) {
    this._runKeyboardAnim(20 + extraBottom)
  }

  render() {
    const { text, disable } = this.props
    return (
      <Animated.View style={{
        position: 'absolute',
        bottom: this.state.bottom,
        marginTop: 10,
        borderRadius: this.state.borderRadius,
        backgroundColor: '#121734',
        left: this.state.marginVertical,
        right: this.state.marginVertical
      }}
      >
        <TouchableOpacity
          disabled={disable}
          onPress={this.onPress}
          style={styles.saveButton}
        >
          <Text style={{ fontSize: 16, color: disable ? AppStyle.secondaryTextColor : AppStyle.mainColor, fontFamily: 'OpenSans-Semibold' }}>
            {text}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  saveButton: {
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
