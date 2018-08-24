import React, { PureComponent } from 'react'
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native'
import PropTypes from 'prop-types'
import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'
import SwitchButton from './SwtichButton'

export default class SettingItem extends PureComponent {
  static propTypes = {
    style: PropTypes.object,
    iconRight: PropTypes.bool,
    subText: PropTypes.string,
    mainText: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    type: PropTypes.string,
    onSwitch: PropTypes.func,
    enableSwitch: PropTypes.bool,
    disable: PropTypes.bool,
    showArrow: PropTypes.bool,
    data: PropTypes.string,
    expanse: PropTypes.bool
  }

  static defaultProps = {
    style: {},
    iconRight: true,
    subText: ' ',
    onPress: () => { },
    type: 'normal',
    onSwitch: () => { },
    enableSwitch: false,
    disable: false,
    showArrow: true,
    data: '',
    expanse: false
  }

  renderRightField = () => {
    const {
      type, onSwitch, enableSwitch, subText, showArrow, expanse
    } = this.props
    if (type === 'switch') {
      return (
        <SwitchButton
          enable={enableSwitch}
          onStateChange={(isActive) => {
            onSwitch(isActive)
          }}
        />
      )
    }
    if (type === 'expanse') {
      return (
        <View style={styles.rightField}>
          <Text style={[styles.text, { marginRight: 10 }]}>{subText}</Text>
          {showArrow &&
            <Image source={expanse ? images.iconUp : images.iconDown} />
          }
        </View>
      )
    }
    return (
      <View style={styles.rightField}>
        <Text style={[styles.text, { marginRight: 10 }]}>{subText}</Text>
        {showArrow &&
          <Image source={images.icon_indicator} />
        }
      </View>
    )
  }

  render() {
    const {
      style, iconRight, mainText, onPress, disable, data, expanse
    } = this.props
    return (
      <View>
        <TouchableOpacity onPress={onPress} disabled={disable}>
          <View style={[styles.container, style]}>
            <Text style={styles.text}>{mainText}</Text>
            {iconRight && this.renderRightField()}
          </View>
        </TouchableOpacity>
        {expanse && data !== '' &&
          <View style={styles.textView}>
            <Text style={styles.textStyle}>{data}</Text>
          </View>}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppStyle.backgroundTextInput,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: AppStyle.borderLinesSetting
  },
  text: {
    color: AppStyle.secondaryTextColor,
    fontSize: 14,
    fontFamily: 'OpenSans-Semibold'
  },
  rightField: {
    flexDirection: 'row'
  },
  textStyle: {
    fontFamily: 'OpenSans',
    fontSize: 14,
    color: AppStyle.backgroundGrey
  },
  textView: {
    paddingBottom: 20,
    paddingTop: 20,
    paddingLeft: 20,
    backgroundColor: AppStyle.backgroundTextInput
  }
})
