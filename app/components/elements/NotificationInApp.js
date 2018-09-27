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
import AppStyle from '../../commons/AppStyle'
import LayoutUtils from '../../commons/LayoutUtils'
import NavStore from '../../AppStores/NavStore'

const { width } = Dimensions.get('window')
const { heightNotif } = LayoutUtils
@observer
export default class NotificationInApp extends Component {
  constructor(props) {
    super(props)
    this.offsetToast = new Animated.Value(-heightNotif)
  }

  onPress = () => {
    this.hideToast()
    NotificationStore.gotoTransaction()
  }

  // get styleText() {
  //   const { notif } = NotificationStore
  //   if (!notif) {
  //     return {}
  //   }
  //   if (notif.type === constant.SENT) {
  //     return { color: AppStyle.colorDown }
  //   }
  //   return { color: AppStyle.colorUp }
  // }

  get content() {
    const { notif } = NotificationStore
    if (!notif) {
      return ''
    }
    return notif.content
  }

  get textStyleNotif() {
    const { notif } = NotificationStore
    if (!notif) {
      return {}
    }
    if (notif.address.toLowerCase() === notif.from.toLowerCase()) return { color: AppStyle.colorDown }
    return { color: AppStyle.colorUp }
  }

  get shouldShowNotifInApp() {
    const { notif, isInitFromNotification, appState } = NotificationStore
    const { currentRouteName } = NavStore
    if (currentRouteName === '' || currentRouteName === 'UnlockScreen') {
      return false
    }
    if (!notif) {
      return false
    }
    if (isInitFromNotification) {
      return false
    }
    if (appState === 'active') {
      return notif.from || notif.inputs
    }
    return false
  }

  showToast(content, style = {}, styleText = {}) {
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
    const { textStyleNotif, content, shouldShowNotifInApp } = this
    if (shouldShowNotifInApp) {
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
          <Text style={[styles.copyText, textStyleNotif]}>{content}</Text>
        </Animated.View>
      </TouchableWithoutFeedback>
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
