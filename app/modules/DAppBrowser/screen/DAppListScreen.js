import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  FlatList,
  Platform
} from 'react-native'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import NavStore from '../../../AppStores/NavStore'
import images from '../../../commons/images'
import LayoutUtils from '../../../commons/LayoutUtils'
import DAppListItem from '../elements/DAppListItem'
import MainStore from '../../../AppStores/MainStore'

const marginTop = LayoutUtils.getExtraTop()

export default class DAppListScreen extends Component {
  constructor(props) {
    super(props)
    this.ready = false
  }

  componentDidMount() {
    setTimeout(() => {
      this.ready = true
    }, 650)
  }
  onBack = () => NavStore.goBack()

  _goToBrowser = (url) => {
    if (!this.ready) return
    MainStore.dapp.setUrl(url)
    NavStore.pushToScreen('DAppBrowserStack')
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationHeader
          style={{ marginTop: 20 + marginTop }}
          headerItem={{
            title: 'DApps',
            icon: null,
            button: images.backButton
          }}
          action={this.onBack}
        />
        <FlatList
          data={data}
          keyExtractor={(v, i) => `${v.title}-${i}`}
          renderItem={({ item, index }) =>
            (
              <DAppListItem
                style={{ marginTop: index === 0 ? 15 : 0 }}
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
    title: 'IDEX',
    subTitle: 'IDEX is a decentralized exchange for trading Ethereum tokens.',
    url: 'https://idex.market/',
    img: 'https://idex.market/static/images/favicon-logo-wt-trans.png'
  },
  {
    title: 'OpenSea',
    subTitle: 'A peer-to-peer marketplace for rare digital items and crypto collectibles. Buy, sell, auction, and discover CryptoKitties, blockchain game items, and much more.',
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
    title: 'DDEX',
    subTitle: 'DDEX is the first decentralized exchange built on Hydro Protocol...',
    url: 'https://ddex.io',
    img: 'https://pbs.twimg.com/profile_images/996789325823074304/huBkgZg4.jpg'
  },
  {
    title: '0x Portal',
    subTitle: 'An Open Protocol For Decentralized Exchange On The Ethereum Blockchain.',
    url: 'https://www.0xproject.com/portal',
    img: 'https://www.bebit.fr/wp-content/uploads/2018/04/0x-.png'
  },
  {
    title: 'Fork Delta',
    subTitle: 'A decentralized Ethereum Token Exchange with the most ERC20 listings of any exchange',
    url: 'https://forkdelta.app',
    img: 'https://forkdelta.io/images/logo.png'
  }
]

const data = Platform.OS === 'ios'
  ? [{
    title: 'Cryptokitties',
    subTitle: "The world's first blockchain games. Breed your rarest cats to create the purrfect furry friend. The future is meow!",
    url: 'https://www.cryptokitties.co',
    img: 'https://vignette.wikia.nocookie.net/cryptokitties/images/7/7f/Kitty-eth.png/revision/latest?cb=20171202061949'
  }, ...dumpData]
  : dumpData
