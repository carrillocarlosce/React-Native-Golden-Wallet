import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions
} from 'react-native'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import NavStore from '../../../AppStores/NavStore'
import images from '../../../commons/images'
import LayoutUtils from '../../../commons/LayoutUtils'
import DAppListItem from '../elements/DAppListItem'
import MainStore from '../../../AppStores/MainStore';

const marginTop = LayoutUtils.getExtraTop()
const { height } = Dimensions.get('window')
const isIPX = height === 812
export default class DAppListScreen extends Component {
  onBack = () => NavStore.goBack()

  _goToBrowser = (url) => {
    MainStore.dapp.setUrl(url)
    NavStore.pushToScreen('DAppBrowserScreen')
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationHeader
          style={{ marginTop: 20 + marginTop }}
          headerItem={{
            title: 'ĐApp',
            icon: null,
            button: images.backButton
          }}
          action={this.onBack}
        />
        <FlatList
          style={{ marginTop: 30, marginBottom: isIPX ? 68 : 34 }}
          data={dumpData}
          keyExtractor={(v, i) => `${v.title}-${i}`}
          renderItem={({ item, index }) =>
            (
              <View>
                <DAppListItem
                  title={item.title}
                  subTitle={item.subTitle}
                  line={index != 0}
                  onPress={() => this._goToBrowser(item.url)}
                />
              </View>
            )
          }
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

const dumpData = [
  {
    title: 'Idex',
    subTitle: 'AirSwap is a global marketplace for trading Ethereum tokens.',
    url: 'https://idex.market/'
  },
  {
    title: 'Skylab',
    subTitle: 'A Simple Hello World Voting Application',
    url: 'https://skylab.vn/voting'
  },
  {
    title: 'Kyber Network',
    subTitle: 'Instant and Secure Token to Token Swaps',
    url: 'https://web3.kyber.network'
  },
  {
    title: '0xproject',
    subTitle: 'Powering decentralized exchange',
    url: 'https://www.0xproject.com'
  },
  {
    title: 'Opensea',
    subTitle: 'The largest marketplace for crypto collectibles',
    url: 'https://opensea.io'
  },
  {
    title: 'Etheremon',
    subTitle: 'The largest marketplace for crypto collectibles',
    url: 'https://www.etheremon.com'
  },
  {
    title: 'Forkdelta',
    subTitle: 'The largest marketplace for crypto collectibles',
    url: 'https://forkdelta.app'
  },
  {
    title: 'Cryptokitties',
    subTitle: 'The largest marketplace for crypto collectibles',
    url: 'https://www.cryptokitties.co'
  }
]
