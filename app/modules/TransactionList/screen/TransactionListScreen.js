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
import TransactionDetail from '../../TransactionDetail/screen/TransactionDetailScreen'
import Modal from '../../../../Libs/react-native-modalbox'

import EmptyList from '../elements/EmptyList'
import AppState from '../../../AppStores/AppState'
import NotificationStore from '../../../AppStores/stores/Notification'
import NavStore from '../../../AppStores/NavStore'
import MainStore from '../../../AppStores/MainStore'

const marginTop = LayoutUtils.getExtraTop()
const { width, height } = Dimensions.get('window')

@observer
export default class TransactionListScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }

  async componentDidMount() {
    if (NotificationStore.isInitFromNotification) {
      setTimeout(() => {
        NavStore.lockScreen({
          onUnlock: (pincode) => {
            NotificationStore.isInitFromNotification = false
            MainStore.setSecureStorage(pincode)
          }
        })
      }, 100)
    }
    if (this.selectedToken) {
      this.selectedToken.fetchTransactions(false)
    }
  }

  componentWillUnmount() {
    const { navigation } = this.props
    const { params } = navigation.state
    const { notif } = NotificationStore
    if (notif && params) {
      NotificationStore.resetSelectedAtAppState()
      NotificationStore.setCurrentNotif(null)
    }
  }

  onPressTxItem = (item) => {
    this.selectedToken.setSelectedTransaction(item)
    NavStore.transactionDetail.open()
  }

  onRefresh = async () => {
    this.selectedToken.fetchTransactions(true)
  }

  onEndReached = async () => {
    this.selectedToken.fetchTransactions(false)
  }

  get selectedToken() {
    return AppState.selectedToken
  }

  goBack = async () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  _renderEmptyList = (selectedToken) => {
    if (!selectedToken.isLoading) {
      return <EmptyList />
    }

    return <View />
  }

  render() {
    const defaultToken = { allTransactions: [], isRefreshing: false, isLoading: true }
    const selectedToken = this.selectedToken ? this.selectedToken : defaultToken
    const transactions = selectedToken.allTransactions
    const { navigation } = this.props
    const { isRefreshing, isLoading, successTransactions } = selectedToken

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
          contentContainerStyle={[{}, transactions.length ? { width } : { flexGrow: 1, justifyContent: 'center' }]}
          ListEmptyComponent={this._renderEmptyList(selectedToken)}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => `${item.hash}-${item.from}-${index}`}
          refreshing={isRefreshing}
          onRefresh={this.onRefresh}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={30}
          renderItem={({ item, index }) => (
            <TransactionItem
              index={index}
              transactionItem={item}
              action={() => { this.onPressTxItem(item) }}
            />
          )}
        />
        <Modal
          style={{
            zIndex: 200,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            overflow: 'hidden',
            height: height - marginTop - 68,
            backgroundColor: AppStyle.backgroundColor
          }}
          position="bottom"
          swipeToClose
          onClosed={() => {

          }}
          ref={(ref) => { NavStore.transactionDetail = ref }}
        >
          <View style={{ height: height - marginTop - 68 }}>
            <View
              style={{
                alignSelf: 'center',
                height: 3,
                width: 45,
                borderRadius: 1.5,
                backgroundColor: AppStyle.secondaryTextColor,
                position: 'absolute',
                zIndex: 30,
                top: 10
              }}
            />
            <TransactionDetail
              onClose={() => { NavStore.transactionDetail.close() }}
              onCheck={(txHash) => { navigation.navigate('TxHashWebViewScreen', { txHash }) }}
            />
          </View>
        </Modal>
        {successTransactions.length === 0 && isLoading && <Spinner />}
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
