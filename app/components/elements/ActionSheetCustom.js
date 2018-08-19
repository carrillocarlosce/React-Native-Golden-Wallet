import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
  TouchableWithoutFeedback
} from 'react-native'
import PropTypes from 'prop-types'
import AppStyle from '../../commons/AppStyle'

const { height, width } = Dimensions.get('window')
const isIPX = height === 812

export default class ActionSheetCustom extends PureComponent {
  static propTypes = {
    children: PropTypes.array,
    onCancel: PropTypes.func
  }

  static defaultProps = {
    children: {},
    onCancel: () => { }
  }

  constructor(props) {
    super(props)
    this.bottom = isIPX ? 54 : 20
    const buttonsLength = props.children.length
    this.initOffsetY = buttonsLength * 52 + 60 + this.bottom
    this.offsetY = new Animated.Value(-this.initOffsetY)
    this.opacity = new Animated.Value(0)
    this.state = {
      visible: false
    }
  }

  _runAnim(toValue, opacity, endAnim = () => { }) {
    Animated.parallel([
      Animated.timing(
        this.offsetY, // The value to drive
        {
          toValue, // Animate to final value of 1
          duration: 250
        }
      ),
      Animated.timing(
        this.opacity, // The value to drive
        {
          toValue: opacity, // Animate to final value of 1
          duration: 250
        }
      )
    ]).start(endAnim)
  }

  show() {
    this.setState({
      visible: true
    }, () => {
      this._runAnim(this.bottom, 0.7)
    })
  }

  hide(onHide = () => { }) {
    this._runAnim(-this.initOffsetY, 0, () => {
      this.setState({ visible: false }, onHide)
    })
  }

  render() {
    const { children, onCancel } = this.props
    const { visible } = this.state
    return (
      <Modal
        visible={visible}
        onRequestClose={() => { }}
        transparent
      >
        <TouchableWithoutFeedback onPress={onCancel}>
          <Animated.View style={[styles.overlay, { opacity: this.opacity }]} />
        </TouchableWithoutFeedback>
        <Animated.View
          style={[styles.container, { bottom: this.offsetY }]}
        >
          <View style={styles.actionButtons}>
            {children}
          </View>
          <TouchableOpacity onPress={onCancel}>
            <View style={styles.CancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    paddingHorizontal: 20,
    flex: 1,
    zIndex: 100
  },
  CancelButton: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    width: width - 40,
    backgroundColor: AppStyle.backgroundDarkBlue
  },
  cancelText: {
    color: AppStyle.mainColor,
    fontSize: 18,
    fontFamily: 'OpenSans-Semibold'
  },
  actionButtons: {
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: AppStyle.backgroundDarkBlue
  },
  overlay: {
    width,
    height,
    position: 'absolute',
    backgroundColor: 'black'
  }
})
