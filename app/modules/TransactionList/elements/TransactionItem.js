import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Platform
} from 'react-native'
import PropTypes from 'prop-types'
import AppStyle from '../../../commons/AppStyle'
import constant from '../../../commons/constant'
import Helper from '../../../commons/Helper'
import PendingTransaction from './PendingTransaction'
import MainStore from '../../../AppStores/MainStore'

export default class TransactionsItem extends Component {
  static propTypes = {
    style: PropTypes.object,
    transactionItem: PropTypes.object,
    action: PropTypes.func,
    index: PropTypes.number.isRequired
  }

  static defaultProps = {
    style: {},
    transactionItem: {},
    action: () => { }
  }

  get colorBalance() {
    const { transactionItem } = this.props
    const { type, isSelf } = transactionItem
    if (type === constant.SENT || isSelf || type === constant.PENDING) {
      return { color: AppStyle.colorDown }
    }
    return { color: AppStyle.colorUp }
  }

  get operator() {
    const { transactionItem } = this.props
    const { type, isSelf } = transactionItem
    if (type === constant.SENT || type === constant.PENDING) {
      return '-'
    }
    if (isSelf) {
      return ''
    }
    return '+'
  }

  get selectedToken() {
    return MainStore.appState.selectedToken
  }

  render() {
    const {
      style,
      transactionItem,
      action,
      index
    } = this.props

    const {
      balance,
      date,
      balanceUSD,
      type,
      status
    } = transactionItem

    const { symbol } = this.selectedToken

    const { colorBalance, operator } = this
    return (
      <TouchableWithoutFeedback onPress={() => { action() }}>
        <View style={[styles.container, style]}>
          {index > 0 &&
            <View
              style={{ height: 1, backgroundColor: AppStyle.colorLines }}
            />
          }
          <View style={[styles.rowStyle, { marginTop: 20 }]}>
            <View style={styles.rowStyle}>
              <Text style={styles.type}>{type}</Text>
              {status === 0 && <PendingTransaction style={{ marginLeft: 4 }} />}
            </View>
            <Text style={[styles.balance, colorBalance]}>
              {`${operator} ${Helper.formatETH(balance.toString(10))} ${symbol}`}
            </Text>
          </View>
          <View style={[styles.rowStyle, { marginTop: 5 }]}>
            <Text style={styles.date}>{date}</Text>
            <Text style={styles.balanceUSD}>{`$${Helper.formatUSD(balanceUSD.toString(10))}`}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  type: {
    fontSize: 18,
    fontFamily: 'OpenSans-Semibold',
    color: AppStyle.mainTextColor
  },
  balance: {
    fontSize: 18,
    fontFamily: 'OpenSans-Semibold'
  },
  date: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
    color: AppStyle.secondaryTextColor,
    opacity: 0.8
  },
  balanceUSD: {
    fontSize: 12,
    fontFamily: 'OpenSans-Semibold',
    color: AppStyle.secondaryTextColor
  }
})
