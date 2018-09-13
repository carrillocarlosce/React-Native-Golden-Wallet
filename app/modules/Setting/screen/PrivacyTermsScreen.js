import React, { Component } from 'react'
import {
  View,
  Dimensions,
  ScrollView
} from 'react-native'
import PropTypes from 'prop-types'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import images from '../../../commons/images'
import LayoutUtils from '../../../commons/LayoutUtils'
import SettingItem from '../elements/SettingItem'
import URL from '../../../api/url'

const marginTop = LayoutUtils.getExtraTop()
const { width } = Dimensions.get('window')

export default class PrivacyTermsScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }

  onPrivacyPress = () => {
    const { navigation } = this.props
    navigation.navigate('PrivacyTermsWebView', {
      url: URL.Skylab.privacyURL(),
      title: 'Privacy Policy'
    })
  }

  onTermsPress = () => {
    const { navigation } = this.props
    navigation.navigate('PrivacyTermsWebView', {
      url: URL.Skylab.termsURL(),
      title: 'Terms'
    })
  }

  goBack = () => {
    this.props.navigation.goBack()
  }

  render() {
    return (
      <View>
        <NavigationHeader
          style={{ marginTop: marginTop + 20, width }}
          headerItem={{
            title: 'Privacy & Terms',
            icon: null,
            button: images.backButton
          }}
          action={this.goBack}
        />
        <ScrollView>
          <SettingItem
            style={{ borderTopWidth: 0, marginTop: 15 }}
            mainText="Privacy"
            onPress={this.onPrivacyPress}
          />
          <SettingItem
            mainText="Terms"
            onPress={this.onTermsPress}
          />
        </ScrollView>
      </View>
    )
  }
}
