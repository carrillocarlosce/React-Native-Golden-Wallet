import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  WebView,
  View,
  StyleSheet,
  Dimensions
} from 'react-native'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import images from '../../../commons/images'
import LayoutUtils from '../../../commons/LayoutUtils'

const marginTop = LayoutUtils.getExtraTop()
const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default class PrivacyTermsWebView extends Component {
  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }
  state = {
    isShow: false
  }

  onLoadEnd = () => {
    this.setState({ isShow: true })
  }

  goBack = () => {
    this.props.navigation.goBack()
  }

  render() {
    const { navigation } = this.props
    const { url, title } = navigation.state.params
    const style = this.state.isShow ? { flex: 1, marginTop: 15 } : { width: 0 }
    return (
      <View style={styles.container}>
        <NavigationHeader
          style={{ marginTop: marginTop + 20, width }}
          headerItem={{
            title,
            icon: null,
            button: images.backButton
          }}
          action={this.goBack}
        />
        <WebView
          style={style}
          source={{ uri: url }}
          onLoadEnd={this.onLoadEnd}
        />
      </View>
    )
  }
}
