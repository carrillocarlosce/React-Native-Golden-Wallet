import React, { Component } from 'react'
import {
  View,
  Platform
} from 'react-native'
import { observer } from 'mobx-react/native'
import MainStore from '../../../AppStores/MainStore'
import Helper from '../../../commons/Helper'
import AppStyle from '../../../commons/AppStyle'
import InformationCard from './InformationCard'

@observer
export default class TokenHeader extends Component {
  get wallet() {
    return MainStore.appState.selectedWallet
  }

  get symbol() {
    const { type } = this.wallet
    if (type === 'ethereum') {
      return 'ETH'
    }
    return 'BTC'
  }

  render() {
    const { totalBalanceETH, totalBalanceDollar } = this.wallet
    return (
      <View style={{ marginBottom: 15 }}>
        <InformationCard
          data={{
            cardItem: this.wallet,
            titleText: 'Estimated Value',
            mainSubTitleText: `${Helper.formatETH(totalBalanceETH.toString(10))} ${this.symbol}`,
            viceSubTitleText: `$${Helper.formatUSD(totalBalanceDollar.toString(10))}`
          }}
          style={{
            marginTop: 15,
            marginHorizontal: 20
          }}
          titleStyle={{
            color: '#8A8D97',
            fontSize: 18,
            fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular'
          }}
          mainSubTitleStyle={{
            color: '#E4BF43',
            fontSize: 30,
            fontFamily: AppStyle.mainFontBold
          }}
          viceSubTitleStyle={{
            color: '#8A8D97',
            fontSize: 16,
            fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
            marginLeft: 8
          }}
        />
      </View>
    )
  }
}
