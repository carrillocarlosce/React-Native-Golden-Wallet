import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Clipboard
} from 'react-native'
import PropTypes from 'prop-types'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import images from '../../../commons/images'
import TransactionDetailItem from '../elements/TransactionDetailItem'
import AppStyle from '../../../commons/AppStyle'
import constant from '../../../commons/constant'
import MainStore from '../../../AppStores/MainStore'
import NavStore from '../../../stores/NavStore'

const { width, height } = Dimensions.get('window')
const isIPX = height === 812

export default class TransactionDetailScreen extends Component {
  static propTypes = {
    onClose: PropTypes.func,
    onCheck: PropTypes.func
  }

  static defaultProps = {
    onClose: () => { },
    onCheck: () => { }
  }

  get selectedTransaction() {
    return MainStore.appState.selectedToken.selectedTransaction
  }

  get selectedToken() {
    return MainStore.appState.selectedToken
  }

  get operator() {
    const { type, isSelf } = this.selectedTransaction
    if (type == constant.SENT || type == constant.PENDING) {
      return '-'
    }
    if (isSelf) {
      return ''
    }
    return '+'
  }

  get value() {
    const { operator } = this
    const { symbol } = this.selectedToken
    return `${operator} ${this.selectedTransaction.balance.toString(10)} ${symbol}`
  }

  _onPress = (message, title) => {
    Clipboard.setString(message)
    NavStore.showToastTop(`${title} Copied`, {}, { color: AppStyle.mainColor })
  }

  renderValue = () => {
    const { type, isSelf } = this.selectedTransaction
    const { value } = this
    return (
      <TransactionDetailItem
        style={{ marginTop: 15 }}
        data={{
          title: 'Value',
          subtitle: value,
          type,
          isSelf
        }}
        action={() => { this._onPress(value, 'Value') }}
      />
    )
  }

  renderTime = () =>
    (
      <TransactionDetailItem
        style={{ marginTop: 15 }}
        data={{
          title: 'Time',
          subtitle: this.selectedTransaction.date
        }}
        action={() => this._onPress(this.selectedTransaction.date, 'Time')}
      />
    )

  renderHash = () =>
    (
      <TransactionDetailItem
        style={{ marginTop: 15 }}
        data={{
          title: 'Transaction Hash',
          subtitle: this.selectedTransaction.hash
        }}
        action={() => this._onPress(this.selectedTransaction.hash, 'Transaction Hash')}
      />
    )

  renderAddress = () => {
    const { isSent } = this.selectedTransaction
    const title = isSent ? 'To' : 'From'
    const subtitle = isSent ? this.selectedTransaction.to : this.selectedTransaction.from
    return (
      <TransactionDetailItem
        style={{ marginTop: 15 }}
        data={{
          title,
          subtitle
        }}
        action={() => this._onPress(subtitle, 'Address')}
      />
    )
  }

  renderFee = () =>
    (
      <TransactionDetailItem
        style={{ marginTop: 15 }}
        data={{
          title: 'Fee',
          subtitle: this.selectedTransaction.fee.toString(10)
        }}
        action={() => { this._onPress(this.selectedTransaction.fee.toString(10), 'Fee') }}
        bottomLine={false}
      />
    )

  render() {
    const { onClose, onCheck } = this.props
    return (
      <View style={[styles.container, { paddingTop: 26 }]}>
        <NavigationHeader
          style={{ width }}
          headerItem={{
            title: this.selectedTransaction.type,
            icon: null,
            button: images.closeButton
          }}
          action={onClose}
        />
        {this.renderValue()}
        {this.renderTime()}
        {this.renderHash()}
        {this.renderAddress()}
        {this.renderFee()}
        <View style={styles.checkButton}>
          <TouchableOpacity
            style={styles.imageCheck}
            onPress={() => { onCheck(this.selectedTransaction.hash) }}
          >
            <Text style={styles.check}>{constant.TEXT_VIEW_DETAIL}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppStyle.backgroundColor
  },
  checkButton: {
    marginTop: 20,
    height: 50,
    bottom: isIPX ? 54 : 20,
    backgroundColor: '#121734',
    borderRadius: 5,
    position: 'absolute',
    left: 20
  },
  check: {
    color: AppStyle.mainColor,
    fontSize: 18,
    fontFamily: 'OpenSans-Semibold'
  },
  imageCheck: {
    width: width - 40,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  }
})
