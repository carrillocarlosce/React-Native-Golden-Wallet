import React, { Component } from 'react'
import {
  View,
  FlatList
} from 'react-native'
import { observer } from 'mobx-react/native'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import TokenItem from '../elements/TokenItem'
import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'
import LayoutUtils from '../../../commons/LayoutUtils'
import ShimmerTokenItem from '../elements/ShimmerTokenItem'
import MainStore from '../../../AppStores/MainStore'
import NavStore from '../../../AppStores/NavStore'
import TokenHeader from '../elements/TokenHeader'

const marginTop = LayoutUtils.getExtraTop()

@observer
export default class TokenScreen extends Component {
  onBack = () => {
    NavStore.goBack()
  }

  onRefreshToken = async () => {
    this.wallet.fetchingBalance(true)
  }

  onItemPress = (index) => {
    MainStore.appState.setselectedToken(this.wallet.tokens[index])
    NavStore.pushToScreen('TransactionListScreen')
  }

  onPressCollectibles = () => NavStore.pushToScreen('CollectibleScreen')

  get wallet() {
    return MainStore.appState.selectedWallet
  }

  renderItem = ({ item, index }) => {
    return (
      <TokenItem
        style={{
          backgroundColor: AppStyle.backgroundContentDarkMode,
          paddingLeft: 10,
          paddingRight: 15,
          marginBottom: 15,
          borderRadius: 5
        }}
        indexToken={index}
        onPress={() => this.onItemPress(index)}
      />)
  }

  render() {
    const {
      title,
      tokens,
      refreshing,
      isFetchingBalance
    } = this.wallet

    return (
      <View style={{ flex: 1 }}>
        <NavigationHeader
          style={{ marginTop: 20 + marginTop }}
          headerItem={{
            title,
            icon: null,
            button: images.backButton
          }}
          action={this.onBack}
          rightView={{
            rightViewIcon: images.iconCollectibles,
            rightViewAction: this.onPressCollectibles,
            rightViewTitle: 'Collectibles'
          }}
        />
        <FlatList
          style={{ flex: 1 }}
          ListHeaderComponent={<TokenHeader />}
          ListFooterComponent={<ShimmerTokenItem visible={isFetchingBalance} />}
          data={tokens}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, _) => `${item.symbol}-${item.address}`}
          refreshing={refreshing}
          onRefresh={this.onRefreshToken}
          renderItem={this.renderItem}
        />
      </View>
    )
  }
}
