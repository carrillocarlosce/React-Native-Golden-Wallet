import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet
} from 'react-native'
import { observer } from 'mobx-react/native'
import PropTypes from 'prop-types'
import AppStyle from '../../../commons/AppStyle'
import MainStore from '../../../AppStores/MainStore'
import AddressElement from '../../../components/elements/AddressElement'
import Helper from '../../../commons/Helper'

@observer
export default class ManageWalletItem extends Component {
  static propTypes = {
    style: PropTypes.object,
    index: PropTypes.number.isRequired,
    onPress: PropTypes.func
    // onDeletePress: PropTypes.func,
    // onEditPress: PropTypes.func
  }

  static defaultProps = {
    style: {},
    onPress: () => { }
    // onEditPress: () => { },
    // onDeletePress: () => { }
  }

  get wallet() {
    const { index } = this.props
    return MainStore.appState.wallets[index]
  }

  render() {
    const {
      style, index, onPress = () => { }
    } = this.props

    const { title, address, totalBalanceETH } = this.wallet
    const borderBottomWidth = {
      borderBottomWidth: index == 9 ? 0 : 1
    }
    return (
      <TouchableWithoutFeedback
        onPress={onPress}
      >
        <View style={[styles.container, borderBottomWidth, style]}>
          <View style={{}}>
            <Text style={styles.name}>{title}</Text>
            <AddressElement
              address={address}
              style={{ marginTop: 10 }}
            />
            {/* <Text
              style={[styles.address, commonStyle.fontAddress]}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
            {address}
            </Text> */}
          </View>
          {/* <MoreButton onPress={action} /> */}
          <Text style={styles.balance}>
            {`${Helper.formatETH(totalBalanceETH)} ETH`}
          </Text>
        </View>
      </TouchableWithoutFeedback >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppStyle.backgroundTextInput,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderColor: AppStyle.borderLinesSetting,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  name: {
    fontSize: 14,
    fontFamily: 'OpenSans-Semibold',
    color: '#3B7CEC'
  },
  balance: {
    fontSize: 16,
    fontFamily: 'OpenSans-Semibold',
    color: 'white',
    alignSelf: 'center'
  }
})
