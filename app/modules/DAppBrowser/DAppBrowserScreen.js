import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Platform,
  Dimensions
} from 'react-native'
import RNFS from 'react-native-fs'
import DAppBrowser from '../../../Libs/react-native-golden-dweb-browser'

import NavigationHeader from '../../components/elements/NavigationHeader'
import images from '../../commons/images'
import LayoutUtils from '../../commons/LayoutUtils'
import NavStore from '../../AppStores/NavStore'
import MainStore from '../../AppStores/MainStore'

const { width, height } = Dimensions.get('window')

const marginTop = LayoutUtils.getExtraTop()

let jsContent = ''
export default class DAppBrowserScreen extends Component {

  componentWillMount() {
    if (jsContent === '') {
      if (Platform.OS === 'ios') {
        RNFS.readFile(`${RNFS.MainBundlePath}/GoldenProvider.js`, 'utf8')
          .then((content) => {
            jsContent = content
            this.setState({})
          })
      } else {
        RNFS.readFileAssets(`GoldenProvider.js`, 'utf8')
          .then((content) => {
            jsContent = content
            this.setState({})
          })
      }
    }
  }

  onBack = () => NavStore.goBack()

  onSignTransaction = ({ id, object }) => {
    console.warn('onSign: ', object)
    MainStore.dapp.setTransaction(id, object)
    NavStore.pushToScreen('DAppConfirmScreen')
  }

  render() {
    // const { walletAddress } = this.store
    const walletAddress = MainStore.appState.selectedWallet.address
    const { url } = MainStore.dapp
    return (
      <View style={styles.container}>
        <NavigationHeader
          style={{ marginTop: 20 + marginTop }}
          headerItem={{
            title: 'ĐApp Browser',
            icon: null,
            button: images.backButton
          }}
          action={this.onBack}
        />
        {jsContent !== '' &&
          <DAppBrowser
            ref={ref => (MainStore.dapp.setWebview(ref))}
            style={styles.container}
            uri={url}
            addressHex={walletAddress}
            network={MainStore.appState.networkName}
            infuraAPIKey="qMZ7EIind33NY9Azu836"
            jsContent={jsContent}
            onSignTransaction={this.onSignTransaction}
          />
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width,
    height
  }
})
