import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
  Text
} from 'react-native'
import PropTypes from 'prop-types'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import BottomButton from '../../../components/elements/BottomButton'
import NavStore from '../../../AppStores/NavStore'
import images from '../../../commons/images'
import { opensansRegular } from '../../../commons/commonStyles'
import AppStyle from '../../../commons/AppStyle'
import MainStore from '../../../AppStores/MainStore'
import LayoutUtils from '../../../commons/LayoutUtils'

const { width } = Dimensions.get('window')
const content = 'Help Golden improve by choosing to share app activity and daily diagnostic. You can change your decision later in Settings.'
const marginTop = LayoutUtils.getExtraTopAndroid()

export default class AppAnalyticScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }

  goBack = () => {
    MainStore.appState.setAllowDailyUsage(false)
    NavStore.goBack()
    this.props.navigation.state.params.onBack()
  }
  onShare = () => {
    MainStore.appState.setAllowDailyUsage(true)
    this.goBack()
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <NavigationHeader
            style={{ marginTop: marginTop + 20, width }}
            headerItem={{
              title: 'App Analytics',
              icon: null,
              button: images.closeButton
            }}
            action={this.goBack}
          />
          <Image source={images.imgAnalytics} style={{ marginTop: 45 }} />
          <Text style={styles.content}>{content}</Text>
          <BottomButton
            onPress={this.onShare}
            text="Share"
          />
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  content: {
    padding: 20,
    marginTop: 40,
    fontSize: 16,
    fontFamily: opensansRegular,
    color: AppStyle.secondaryTextColor,
    textAlign: 'center'
  }
})
