import React, { Component } from 'react'
import {
  StyleSheet,
  View
} from 'react-native'
import DAppBrowser from '../../../Libs/react-native-golden-dweb-browser'
import DAppBrowserStore from './DAppBrowserStore'

import NavigationHeader from '../../components/elements/NavigationHeader'
import images from '../../commons/images'
import LayoutUtils from '../../commons/LayoutUtils'
import NavStore from '../../AppStores/NavStore'

const marginTop = LayoutUtils.getExtraTop()

export default class DAppBrowserScreen extends Component {
  constructor(props) {
    super(props)
    this.store = new DAppBrowserStore()
  }

  onBack = () => NavStore.goBack()

  render() {
    const { walletAddress } = this.store
    return (
      <View style={styles.container}>
        <NavigationHeader
          style={{ marginTop: 20 + marginTop }}
          headerItem={{
            title: 'DApp Browser',
            icon: null,
            button: images.backButton
          }}
          action={this.onBack}
        />
        <DAppBrowser
          style={styles.container}
          uri="https://web3.kyber.network"
          addressHex={walletAddress}
          network="mainnet"
          infuraAPIKey="llyrtzQ3YhkdESt2Fzrk"
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
