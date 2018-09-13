import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  SafeAreaView
} from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react/native'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import LayoutUtils from '../../../commons/LayoutUtils'
import images from '../../../commons/images'
import MainStore from '../../../AppStores/MainStore'
import NavStore from '../../../AppStores/NavStore'
import { opensansRegular } from '../../../commons/commonStyles'
import AppStyle from '../../../commons/AppStyle'
import BottomButton from '../../../components/elements/BottomButton'
import Router from '../../../AppStores/Router'

const marginTop = LayoutUtils.getExtraTop()
const { width } = Dimensions.get('window')

@observer
export default class CollectibleDetailScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }

  onBack = () => NavStore.goBack()

  onPress = () => {
    const { assetContractName } = this.collectible
    Router.DAppBrowser.goToDApp()
    let url = ''
    if (assetContractName === 'Etheremon') {
      url = `https://www.etheremon.com/mons-info/${this.collectible.id}`
    } else if (assetContractName === 'CryptoKitties') {
      url = `https://www.cryptokitties.co/kitty/${this.collectible.id}`
    }
    MainStore.dapp.setUrl(url)
    NavStore.pushToScreen('DAppBrowserScreen')
  }

  get collectible() {
    const { index } = this.props.navigation.state.params
    return MainStore.appState.selectedWallet.collectibles[index]
  }

  render() {
    const {
      tokenName, backgroundColor, previewUrl, description, assetContractName
    } = this.collectible
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <NavigationHeader
            style={{ marginTop: 20 + marginTop }}
            headerItem={{
              title: tokenName,
              icon: null,
              button: images.backButton
            }}
            action={this.onBack}
          />

          <View style={[styles.backgroundImage, { backgroundColor }]}>
            <Image style={{ height: 250, width: width - 40 }} resizeMode="contain" source={{ uri: previewUrl }} />
          </View>
          <Text style={styles.description}>{description}</Text>
          <BottomButton
            onPress={this.onPress}
            text={`Open on ${assetContractName}`}
          />
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  backgroundImage: {
    width: width - 40,
    height: 250,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  description: {
    fontFamily: opensansRegular,
    fontSize: 16,
    color: AppStyle.secondaryTextColor,
    margin: 20,
    alignSelf: 'center'
  }
})
