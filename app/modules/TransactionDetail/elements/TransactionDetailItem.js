import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import PropTypes from 'prop-types'
import AppStyle from '../../../commons/AppStyle'
import constant from '../../../commons/constant'
import AddressElement from '../../../components/elements/AddressElement'

export default class TransactionDetailItem extends Component {
  static propTypes = {
    textStyle: PropTypes.array,
    typeAddressElement: PropTypes.bool,
    style: PropTypes.object,
    data: PropTypes.object,
    action: PropTypes.func,
    bottomLine: PropTypes.bool,
    children: PropTypes.object
  }

  static defaultProps = {
    textStyle: [],
    typeAddressElement: false,
    style: {},
    data: {
      title: 'Value',
      type: constant.SENT,
      subtitle: '-0.0028 ETH'
    },
    action: () => { },
    bottomLine: true,
    children: null
  }

  get styleSubtitle() {
    const { data } = this.props

    const {
      title, type, isSelf
    } = data
    let styleSubtitle = {
      fontSize: 14,
      fontFamily: 'OpenSans-Semibold',
      color: AppStyle.secondaryTextColor
    }
    if ((type === constant.SENT && title === 'Value') || isSelf || type === constant.PENDING) {
      styleSubtitle = {
        fontSize: 18,
        fontFamily: 'OpenSans-Semibold',
        color: AppStyle.colorDown
      }
    } else if (type === constant.RECEIVED && title === 'Value') {
      styleSubtitle = {
        fontSize: 18,
        fontFamily: 'OpenSans-Semibold',
        color: AppStyle.colorUp
      }
    }
    return styleSubtitle
  }

  render() {
    const {
      style,
      data,
      action,
      bottomLine,
      typeAddressElement,
      textStyle,
      children
    } = this.props

    const {
      title,
      subtitle
    } = data

    const { styleSubtitle } = this

    return (
      <TouchableOpacity onPress={() => { action() }}>
        <View style={[styles.container, style]}>
          <View style={{}}>
            <Text style={styles.title}>{title}</Text>
            {!typeAddressElement &&
              <Text
                numberOfLines={1}
                ellipsizeMode="middle"
                style={[styleSubtitle, textStyle]}
              >
                {subtitle}
              </Text>}
            {typeAddressElement && <AddressElement
              address={subtitle}
              style={{ width: 328, marginTop: 10 }}
            />}
          </View>
          {children && children}
          {bottomLine &&
            <View
              style={{
                height: 1,
                backgroundColor: AppStyle.colorLines,
                marginTop: 15
              }}
            />
          }
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 20
  },
  title: {
    fontSize: 18,
    fontFamily: 'OpenSans-Semibold',
    color: AppStyle.mainTextColor
  }
})
