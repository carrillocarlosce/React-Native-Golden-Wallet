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
          style={{ marginTop: 20 + marginTop, marginBottom: 15 }}
          headerItem={{
            title: 'ĐApp',
            icon: null,
            button: images.backButton
          }}
          action={this.onBack}
        />
        <FlatList
          data={dumpData}
          keyExtractor={(v, i) => `${v.title}-${i}`}
          renderItem={({ item, index }) =>
            (
              <DAppListItem
                title={item.title}
                subTitle={item.subTitle}
                line={index != 0}
                img={{ uri: item.img }}
                onPress={() => this._goToBrowser(item.url)}
              />
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
    title: 'Kyber Network',
    subTitle: 'An instant decentralized cryptocurrency exchange service.',
    url: 'https://web3.kyber.network',
    img: 'https://cdn.cryptostats.net/assets/images/coins/310497-KNC.png'
  },
  {
    title: 'Idex',
    subTitle: 'IDEX is a decentralized exchange for trading Ethereum tokens.',
    url: 'https://idex.market/',
    img: 'https://idex.market/static/images/favicon-logo-wt-trans.png'
  },
  {
    title: 'Opensea',
    subTitle: 'The largest market for crypto collectibles. Make offers on favorite..',
    url: 'https://opensea.io',
    img: 'https://pbs.twimg.com/profile_images/988983240458305538/KNIW8ufg_400x400.jpg'
  },
  {
    title: 'Etheremon',
    subTitle: 'A world of Ether monster where you can captures, transform,...',
    url: 'https://www.etheremon.com',
    img: 'https://pbs.twimg.com/profile_images/960520740196909056/3RBArulO_400x400.jpg'
  },
  {
    title: '0x Portal',
    subTitle: 'Learn about 0x and discover 0x Relayers...',
    url: 'https://www.0xproject.com/portal',
    img: 'https://www.bebit.fr/wp-content/uploads/2018/04/0x-.png'
  },
  {
    title: 'Forkdelta',
    subTitle: 'A decentralized Ethereum Token Exchange with the most ERC20...',
    url: 'https://forkdelta.app',
    img: 'https://forkdelta.io/images/logo.png'
  },
  {
    title: 'Cryptokitties',
    subTitle: 'The largest marketplace for crypto collectibles',
    url: 'https://www.cryptokitties.co',
    img: 'https://vignette.wikia.nocookie.net/cryptokitties/images/7/7f/Kitty-eth.png/revision/latest?cb=20171202061949'
  }
]
