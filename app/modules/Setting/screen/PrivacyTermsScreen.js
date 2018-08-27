import React, { Component } from 'react'
import {
  View,
  StyleSheet,
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

  render() {
    const { navigation } = this.props
    return (
      <View style={styles.container}>
        <NavigationHeader
          style={{ marginTop: marginTop + 20, width }}
          headerItem={{
            title: 'Privacy & Terms',
            icon: null,
            button: images.backButton
          }}
          action={() => {
            navigation.goBack()
          }}
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
          {/* <SettingItem
            style={{ marginTop: 40 }}
            mainText="Dialy usage"
            disable
            type="switch"
            enableSwitch={true}
            onSwitch={() => { }}
          />
          <Text style={styles.textDes}>Help Golden improve user experience by sharing app daily diagnostic.</Text>
          <SettingItem
            style={{ marginTop: 30 }}
            mainText="Crash reports"
            disable
            type="switch"
            enableSwitch={true}
            onSwitch={() => { }}
          />
          <Text style={styles.textDes} t>Help Golden improve user experience by sharing app daily diagnostic.</Text> */}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {

  }
  // textDes: {
  //   fontSize: 12,
  //   fontFamily: 'OpenSans-Semibold',
  //   color: AppStyle.secondaryTextColor,
  //   marginTop: 20,
  //   paddingHorizontal: 15
  // }
})
