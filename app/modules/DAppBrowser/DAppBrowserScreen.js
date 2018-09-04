import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Platform,
  Dimensions
} from 'react-native'
import RNFS from 'react-native-fs'
import DAppBrowser from '../../../Libs/react-native-golden-dweb-browser'
import DAppBrowserStore from './DAppBrowserStore'

import NavigationHeader from '../../components/elements/NavigationHeader'
import images from '../../commons/images'
import LayoutUtils from '../../commons/LayoutUtils'
import NavStore from '../../AppStores/NavStore'

const { width, height } = Dimensions.get('window')

const marginTop = LayoutUtils.getExtraTop()

let jsContent = ''
export default class DAppBrowserScreen extends Component {
  constructor(props) {
    super(props)
    this.store = new DAppBrowserStore()
  }

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
    // NavStore.pushToScreen('DAppConfirmScreen')
  }

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
        {jsContent !== '' &&
          <DAppBrowser
            style={styles.container}
            uri="https://web3.kyber.network"
            addressHex={walletAddress}
            network="mainnet"
            infuraAPIKey="llyrtzQ3YhkdESt2Fzrk"
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
