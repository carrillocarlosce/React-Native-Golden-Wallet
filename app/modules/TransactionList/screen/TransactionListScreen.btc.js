import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList
} from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react/native'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'
import TransactionItem from '../elements/TransactionItem'
import Spinner from '../../../components/elements/Spinner'
import LayoutUtils from '../../../commons/LayoutUtils'

import EmptyList from '../elements/EmptyList'
import AppState from '../../../AppStores/AppState'
import NavStore from '../../../AppStores/NavStore'
import MainStore from '../../../AppStores/MainStore'

const marginTop = LayoutUtils.getExtraTop()
const { width } = Dimensions.get('window')

@observer
export default class TransactionBTCListScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }

  async componentDidMount() {
    if (this.selectedToken) {
      this.selectedToken.fetchTransactions(false)
    }
  }

  onPressTxItem = (item) => {
    MainStore.appState.setSelectedTransaction(item)
    if (item.walletType === 'ethereum') {
      NavStore.pushToScreen('TransactionDetailScreen')
    } else if (item.walletType === 'bitcoin') {
      NavStore.pushToScreen('TransactionBTCDetailScreen')
    }
  }

  onRefresh = async () => {
    AppState.selectedWallet.fetchingBalance(true, false)
  }

  get selectedToken() {
    return AppState.selectedWallet.tokens[0]
  }

  goBack = async () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  _renderEmptyList = () => {
    if (!AppState.selectedWallet.loading) {
      return <EmptyList />
    }

    return <View />
  }

  _renderItem = ({ item, index }) => (
    <TransactionItem
      index={index}
      transactionItem={item}
      action={() => { this.onPressTxItem(item) }}
    />
  )

  render() {
    const defaultToken = {
      allTransactions: [], isRefreshing: false, isLoading: true, successTransactions: []
    }
    const selectedToken = this.selectedToken ? this.selectedToken : defaultToken
    const transactions = selectedToken.allTransactions.slice()
    const { loading, isRefresh } = AppState.selectedWallet

    return (
      <View style={styles.container}>
        <NavigationHeader
          style={{ marginTop: marginTop + 20, width }}
          headerItem={{
            title: 'Transactions',
            icon: null,
            button: images.backButton
          }}
          action={this.goBack}
        />
        <FlatList
          data={transactions}
          contentContainerStyle={[transactions.length ? { width } : { flexGrow: 1, justifyContent: 'center' }]}
          ListEmptyComponent={this._renderEmptyList()}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => `${item.hash}-${item.from}-${index}`}
          refreshing={isRefresh}
          onRefresh={this.onRefresh}
          renderItem={this._renderItem}
        />
        {transactions.length === 0 && loading && <Spinner />}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: AppStyle.backgroundColor,
    flex: 1
  }
})
