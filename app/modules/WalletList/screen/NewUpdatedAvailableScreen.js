import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  ScrollView,
  Linking,
  Platform
} from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react/native'
import { NavigationActions } from 'react-navigation'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import LayoutUtils from '../../../commons/LayoutUtils'
import constant from '../../../commons/constant'
import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'
import AppVersion from '../../../AppStores/stores/AppVersion'
import MainStore from '../../../AppStores/MainStore'

const marginTop = LayoutUtils.getExtraTop()
const { height } = Dimensions.get('window')
const isIPX = height === 812
// const string = 'Hi all, Golden Wallet 1.0.4 is ready on AppStore/Google Store.\r\n\r\nWe will update Golden as soon as possible to make it better experience for the community. Here are the improvements you will find in this latest update:\r\n\r\nADDED\r\n- Header Pricing of top 10 coins on Coinmarket Cap.\r\n- Quick action to adjust gas price Slow/Standard/Fast.\r\n\r\nCHANGED\r\n- New UI of Send/Receive button on Home Screen.\r\n- New UI for QR Scanner.\r\n- Refactor source code prepare for Open Source.\r\n\r\nFIXED\r\n- Minor UI bugs.\r\n- Missing incoming and outgoing transactions.\r\n- Missing pending transaction.\r\n\r\nREMOVED\r\n- Send/Receive function in Transaction list.'

@observer
export default class NewUpdatedAvailableScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }

  get lastestVersion() {
    return AppVersion.latestVersion.version_number
  }

  goBack = () => {
    const { navigation } = this.props
    navigation.dispatch(NavigationActions.back())
    MainStore.appState.setShouldShowUpdatePopup(false)
    MainStore.appState.setLastestVersionRead(this.lastestVersion)
    MainStore.appState.save()
  }

  openStore = () => {
    Linking.openURL(Platform.OS === 'ios'
      ? 'https://itunes.apple.com/us/app/golden-best-wallet-ever/id1399824799?mt=8'
      : 'https://play.google.com/store/apps/details?id=io.goldenwallet')
  }

  _renderSendBtn() {
    return (
      <TouchableOpacity
        style={styles.sendBtn}
        onPress={() => this.openStore()}
      >
        <Text style={styles.sendText}>{constant.UPDATE}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    const changeLogs = AppVersion.latestVersion.change_logs
    return (
      <View style={styles.container}>
        <NavigationHeader
          style={{ marginTop: marginTop + 20 }}
          headerItem={{
            title: constant.NEW_UPDATE,
            icon: null,
            button: images.closeButton
          }}
          action={this.goBack}
        />
        <ScrollView style={styles.viewStyle}>
          <Text style={styles.textStyle}>{changeLogs}</Text>
        </ScrollView>
        {this._renderSendBtn()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  sendBtn: {
    position: 'absolute',
    backgroundColor: AppStyle.backgroundDarkBlue,
    borderRadius: 5,
    bottom: isIPX ? 54 : 20,
    left: 20,
    right: 20,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendText: {
    color: AppStyle.mainColor,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 18
  },
  textStyle: {
    fontFamily: 'OpenSans',
    fontSize: 14,
    color: AppStyle.backgroundGrey
  },
  viewStyle: {
    flex: 1,
    marginTop: 30,
    marginBottom: isIPX ? 124 : 84,
    marginHorizontal: 20
  }
})
