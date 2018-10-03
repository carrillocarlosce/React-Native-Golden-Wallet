import React, { Component } from 'react'
import {
  View,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text
} from 'react-native'
import { observer } from 'mobx-react/native'
import PropTypes from 'prop-types'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import images from '../../../commons/images'
import LayoutUtils from '../../../commons/LayoutUtils'
import SettingItem from '../elements/SettingItem'
import URL from '../../../api/url'
import MainStore from '../../../AppStores/MainStore'
import AppStyle from '../../../commons/AppStyle'

const marginTop = LayoutUtils.getExtraTop()
const { width } = Dimensions.get('window')
const contentDailyUsage = 'Help Golden improve user experience by sharing app daily diagnostic.'

@observer
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

  onSwitch = (isEnable) => {
    MainStore.appState.setAllowDailyUsage(isEnable)
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
          <SettingItem
            style={{ marginTop: 30 }}
            mainText="Daily Usage"
            disable
            type="switch"
            enableSwitch={MainStore.appState.allowDailyUsage}
            onSwitch={this.onSwitch}
          />
          <Text style={styles.contentDailyUsage}>{contentDailyUsage}</Text>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  contentDailyUsage: {
    paddingHorizontal: 15,
    marginTop: 20,
    color: AppStyle.secondaryTextColor,
    fontSize: 12,
    fontFamily: 'OpenSans-Semibold'
  }
})
