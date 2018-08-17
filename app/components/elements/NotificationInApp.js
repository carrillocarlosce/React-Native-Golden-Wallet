import React, { Component } from 'react'
import {
  Animated,
  StyleSheet,
  Dimensions,
  Text,
  TouchableWithoutFeedback
} from 'react-native'
// import PropTypes from 'prop-types'
import { observer } from 'mobx-react/native'
import HapticHandler from '../../Handler/HapticHandler'
import NotificationStore from '../../AppStores/stores/Notification'
import constant from '../../commons/constant'
import AppStyle from '../../commons/AppStyle'

const { width } = Dimensions.get('window')
@observer
export default class NotificationInApp extends Component {
  constructor(props) {
    super(props)
    this.offsetToast = new Animated.Value(-100)
  }

  onPress = () => {
    this.hideToast()
    NotificationStore.gotoTransactionList()
  }

  get styleText() {
    const { notif } = NotificationStore
    if (!notif) {
      return {}
    }
    if (notif.type === constant.SENT) {
      return { color: AppStyle.colorDown }
    }
    return { color: AppStyle.colorUp }
  }

  get content() {
    const { notif } = NotificationStore
    if (!notif) {
      return ''
    }
    return notif.content
  }

  showToast(content, style = {}, styleText = {}) {
    setTimeout(() => HapticHandler.ImpactLight(), 100)
    Animated.timing(this.offsetToast, {
      toValue: 0,
      duration: 250
    }).start()
    setTimeout(() => this.hideToast(), 4000)
  }

  hideToast() {
    Animated.timing(this.offsetToast, {
      toValue: -100,
      duration: 250
    }).start()
  }

  render() {
    const { notif } = NotificationStore
    const { styleText, content } = this
    if (notif && NotificationStore.appState === 'active') {
      this.showToast()
    }
    return (
      <TouchableWithoutFeedback onPress={this.onPress}>
        <Animated.View
          style={[styles.container, {
            transform: [
              {
                translateY: this.offsetToast
              }
            ]
          }]}
        >
          <Text style={[styles.copyText, styleText]}>{content}</Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width,
    height: 100,
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
