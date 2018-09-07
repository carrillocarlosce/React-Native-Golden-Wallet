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
    const { progress } = event.nativeEvent
    let reset = null
    if (progress === 100) {
      reset = this.resetProgress
    }
    this.startProgress(event.nativeEvent.progress, 250, reset)
  }

  onLoadStart = (event) => {
    const { url } = event.nativeEvent
    MainStore.dapp.setUrl(url)
    console.warn(event.nativeEvent)
    MainStore.dapp.setWebviewState(event.nativeEvent)
  }

  onSubmitEditing = () => {
    MainStore.dapp.loadSource()
  }

  onClose = () => NavStore.goBack()

  onReload = () => {
    MainStore.dapp.reload()
  }

  onProgress = (p) => {
    if (Platform.OS === 'android') return
    if (p === 1) {
      this.startProgress(100, 250)
      setTimeout(() => this.startProgress(0, 0), 250)
    } else {
      this.startProgress(100 * p, 250)
    }
  }

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

  render() {
    const walletAddress = MainStore.appState.selectedWallet.address
    const { url } = MainStore.dapp
    const { loadNew } = this.state
    const progress = this.webProgress.interpolate({
      inputRange: [0, 100],
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
              onProgress={this.onProgress}
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
