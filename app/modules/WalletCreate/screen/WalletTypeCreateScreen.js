import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Dimensions
} from 'react-native'
import { observer } from 'mobx-react/native'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import SmallCard from '../../../components/elements/SmallCard'
import LayoutUtils from '../../../commons/LayoutUtils'
import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'
import NavStore from '../../../AppStores/NavStore'
import { chainNames } from '../../../Utils/WalletAddresses'

const marginTop = LayoutUtils.getExtraTop()
const { width } = Dimensions.get('window')

@observer
export default class WalletTypeCreateScreen extends Component {
  goBack = () => {
    NavStore.goBack()
  }

  gotoEnterNameETH = () => {
    NavStore.pushToScreen('EnterNameScreen', {
      coin: chainNames.ETH
    })
  }

  gotoEnterNameBTC = () => {
    NavStore.pushToScreen('EnterNameScreen', {
      coin: chainNames.BTC
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationHeader
          style={{ marginTop: marginTop + 20 }}
          headerItem={{
            title: 'Create a New Wallet',
            icon: null,
            button: images.backButton
          }}
          action={this.goBack}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

          <SmallCard
            style={{ height: 214 }}
            title="Bitcoin"
            subtitle=""
            imageCard={images.imgCardBTC}
            onPress={this.gotoEnterNameBTC}
            imageBackground="backgroundCard"
            titleTextStyle={{ color: AppStyle.mainColor }}
            subtitleTextStyle={{ color: AppStyle.secondaryTextColor, marginTop: 4, fontSize: 16 }}
          />

          <SmallCard
            style={{ marginTop: 40 }}
            title="Ethereum"
            subtitle=""
            imageCard={images.imgCardETH}
            onPress={this.gotoEnterNameETH}
            imgBackground="backgroundCard"
            imgBackgroundStyle={{ height: 214, borderRadius: 14, width: width - 40 }}
            titleTextStyle={{ color: AppStyle.mainTextColor }}
            subtitleTextStyle={{ color: AppStyle.secondaryTextColor, marginTop: 4, fontSize: 16 }}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
