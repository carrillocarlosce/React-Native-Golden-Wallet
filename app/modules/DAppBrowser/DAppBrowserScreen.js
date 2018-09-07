import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Platform,
  Dimensions,
  Animated
} from 'react-native'
import RNFS from 'react-native-fs'
/* eslint-disable-next-line */
import DAppBrowser from '../../../Libs/react-native-golden-dweb-browser'
import NavStore from '../../AppStores/NavStore'
import MainStore from '../../AppStores/MainStore'
import DAppHeader from './elements/DAppHeader'
import DAppFooter from './elements/DAppFooter'
import AppStyle from '../../commons/AppStyle'

const { width, height } = Dimensions.get('window')
const isIPX = height === 812

let jsContent = ''
export default class DAppBrowserScreen extends Component {
  constructor(props) {
    super(props)
    this.state = { loadNew: false }
    this.webProgress = new Animated.Value(0)
    this.webHistory = []
    this.currentWebState = -1
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
    MainStore.dapp.setTransaction(id, object)
    NavStore.pushToScreen('DAppConfirmScreen')
  }

  onLoadEnd = (event) => {
    this.startProgress(1, 500, this.resetProgress)
    // console.log(event.nativeEvent)
  }

  onLoadStart = (event) => {
    this.startProgress(0.7, 2000)
    MainStore.dapp.setUrl(event.nativeEvent.url)
  }

  onSubmitEditing = () => {
    this.hackLoadNewPage()
  }

  onClose = () => NavStore.goBack()

  onReload = () => this.hackLoadNewPage(this.currentPage)

  startProgress = (val, t, onEndAnim = () => { }) => {
    Animated.timing(this.webProgress, {
      toValue: val,
      duration: t
    }).start(onEndAnim)
  }

  resetProgress = () => {
    Animated.timing(this.webProgress, {
      toValue: 0,
      duration: 0
    }).start()
  }

  goBack = () => MainStore.dapp.goBack()
  goForward = () => MainStore.dapp.goForward()

  hackLoadNewPage = (currentPage = null) => {
    if (currentPage) {
      MainStore.dapp.setUrl(currentPage)
    }
    this.setState({
      loadNew: true
    }, () => {
      this.setState({
        loadNew: false
      })
    })
  }

  render() {
    const walletAddress = MainStore.appState.selectedWallet.address
    const { url } = MainStore.dapp
    this.currentPage = url
    const { loadNew } = this.state
    const progress = this.webProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, width]
    })
    return (
      <View style={styles.container}>
        <DAppHeader
          onSubmitEditing={this.onSubmitEditing}
          onClose={this.onClose}
        />
        <Animated.View style={[styles.progress, { width: progress }]} />
        {jsContent !== '' && !loadNew &&
          <View style={styles.webview}>
            <DAppBrowser
              ref={ref => (MainStore.dapp.setWebview(ref))}
              uri={url}
              addressHex={walletAddress}
              network={MainStore.appState.networkName}
              infuraAPIKey="qMZ7EIind33NY9Azu836"
              jsContent={jsContent}
              onSignTransaction={this.onSignTransaction}
              onLoadEnd={this.onLoadEnd}
              onLoadStart={this.onLoadStart}
            />
          </View>
        }
        <DAppFooter
          goBack={this.goBack}
          goForward={this.goForward}
          onReload={this.onReload}
          style={styles.footer}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  webview: {
    flex: 1,
    marginBottom: isIPX ? 84 : 50
  },
  footer: {
    position: 'absolute',
    bottom: isIPX ? 34 : 0
  },
  progress: {
    height: 1,
    backgroundColor: AppStyle.mainColor
  }
})
