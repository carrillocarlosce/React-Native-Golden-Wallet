import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Clipboard
} from 'react-native'
import Share from 'react-native-share'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react/native'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import images from '../../../commons/images'
import TransactionDetailItem from '../elements/TransactionDetailItem'
import AppStyle from '../../../commons/AppStyle'
import constant from '../../../commons/constant'
import MainStore from '../../../AppStores/MainStore'
import NavStore from '../../../AppStores/NavStore'
import LayoutUtils from '../../../commons/LayoutUtils'
import Spinner from '../../../components/elements/Spinner'
import NotificationStore from '../../../AppStores/stores/Notification'
import URL from '../../../api/url'
import AppState from '../../../AppStores/AppState'
import commonStyle from '../../../commons/commonStyles'

const { width, height } = Dimensions.get('window')
const isIPX = height === 812
const marginTop = LayoutUtils.getExtraTop()

@observer
export default class TransactionDetailScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }

  componentWillUnmount() {
    const { navigation } = this.props
    const { params } = navigation.state
    const { notif } = NotificationStore
    if (notif && params) {
      NotificationStore.setCurrentNotif(null)
    }
  }

  onShareLink = () => {
    NavStore.preventOpenUnlockScreen = true
    const { hash } = this.selectedTransaction
    const { networkName } = AppState
    const shareOptions = {
      title: 'Golden',
      message: 'My Etherscan link',
      url: `${URL.EtherScan.webURL(networkName)}/tx/${hash}`
    }
    Share.open(shareOptions).catch(() => { })
  }

  get selectedTransaction() {
    return MainStore.appState.selectedTransaction
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
    let symbol = ''

    if (this.selectedTransaction.tokenSymbol) {
      symbol = this.selectedTransaction.tokenSymbol
    } else {
      symbol = this.selectedToken.symbol
    }

    return `${operator} ${this.selectedTransaction.balance.toString(10)} ${symbol}`
  }

  _onPress = (message, title) => {
    Clipboard.setString(message)
    NavStore.showToastTop(`${title} Copied`, {}, { color: AppStyle.mainColor })
  }

  _onClose = () => NavStore.goBack()

  _onCheck = () => {
    NavStore.pushToScreen('TxHashWebViewScreen', { txHash: this.selectedTransaction.hash })
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
          subtitle: this.selectedTransaction.hash,
          type: 'address'
        }}
        textStyle={[commonStyle.fontAddress, { marginTop: 10 }]}
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
        typeAddressElement={true}
        data={{
          title,
          subtitle,
          type: 'address'
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
          title: 'Estimate Fee',
          subtitle: this.selectedTransaction.feeFormat
        }}
        action={() => { this._onPress(this.selectedTransaction.fee.toString(10), 'Fee') }}
        bottomLine={false}
      />
    )

  render() {
    const { selectedTransaction } = this
    return (
      <View style={[styles.container, { marginTop: marginTop + 20 }]}>
        <NavigationHeader
          style={{ width }}
          headerItem={{
            title: selectedTransaction ? selectedTransaction.type : 'Transaction Detail',
            icon: null,
            button: images.backButton
          }}
          rightView={{
            rightViewIcon: images.iconShare,
            rightViewAction: this.onShareLink,
            styleContainer: {
              bottom: 10,
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center'
            }
          }}
          action={this._onClose}
        />
        {selectedTransaction &&
          <View style={{ flex: 1 }}>
            {this.renderValue()}
            {this.renderTime()}
            {this.renderHash()}
            {this.renderAddress()}
            {this.renderFee()}
            <View style={styles.checkButton}>
              <TouchableOpacity
                style={styles.imageCheck}
                onPress={this._onCheck}
              >
                <Text style={styles.check}>{constant.TEXT_VIEW_DETAIL}</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        {!selectedTransaction &&
          <Spinner />
        }
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
