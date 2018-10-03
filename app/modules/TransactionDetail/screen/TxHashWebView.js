import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { WebView, View, StyleSheet, Dimensions } from 'react-native'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import Spinner from '../../../components/elements/Spinner'
import images from '../../../commons/images'
import LayoutUtils from '../../../commons/LayoutUtils'
import NavStore from '../../../AppStores/NavStore'

const marginTop = LayoutUtils.getExtraTop()
const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1
    // marginTop: marginTop + 10,
  }
})

export default class TxHashWebViewScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }

  state = {
    isShow: false
  }

  onBack = () => {
    NavStore.goBack()
  }

  render() {
    const { navigation } = this.props
    const { url, jsCode } = navigation.state.params

    const style = this.state.isShow ? { flex: 1 } : { width: 0 }
    return (
      <View style={styles.container}>
        <NavigationHeader
          style={{ marginTop: marginTop + 20, width, marginBottom: 15 }}
          headerItem={{
            title: 'TxHash',
            icon: null,
            button: images.backButton
          }}
          action={this.onBack}
        />
        <WebView
          style={style}
          source={{ uri: url }}
          injectedJavaScript={jsCode}
          onLoadEnd={() => this.setState({ isShow: true })}
        />
        {!this.state.isShow && <Spinner />}
      </View>
    )
  }
}
