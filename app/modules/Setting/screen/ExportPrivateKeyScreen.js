import React, { Component } from 'react'
import {
  View,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  Clipboard
} from 'react-native'
import QRCode from 'react-native-qrcode'
import PropsType from 'prop-types'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import images from '../../../commons/images'
import LayoutUtils from '../../../commons/LayoutUtils'
import NavStore from '../../../AppStores/NavStore'
import AppStyle from '../../../commons/AppStyle'

const marginTop = LayoutUtils.getExtraTop()
const { width } = Dimensions.get('window')

export default class ExportPrivateKeyScreen extends Component {
  static propTypes = {
    navigation: PropsType.object
  }

  static defaultProps = {
    navigation: null
  }

  render() {
    const { pk, walletName, address } = this.props.navigation ? this.props.navigation.state.params : {}
    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader
          style={{ marginTop: 20 + marginTop }}
          headerItem={{
            title: 'Your Private Key',
            icon: null,
            button: images.backButton
          }}
          action={() => {
            NavStore.goBack()
          }}
        />
        <Text style={styles.des}>Make sure your enviroment is secure, and no one sees your screen. </Text>
        <View style={styles.qrCodeContainer}>
          <QRCode
            value={pk}
            size={width - 70 - 100}
            bgColor="black"
            fgColor="white"
          />
          <Text style={styles.walletname}>{walletName}</Text>
          <Text style={styles.privatekey}>{pk}</Text>
          <TouchableOpacity
            style={styles.copybt}
            onPress={() => {
              Clipboard.setString(pk)
              NavStore.showToastTop('Private Key Copied!', {}, { color: AppStyle.mainColor })
            }}
          >
            <Text style={styles.copy}>Copy</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppStyle.backgroundDarkMode
  },
  des: {
    fontSize: 16,
    fontFamily: AppStyle.mainFontSemiBold,
    color: '#E5E5E5',
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
    textAlign: 'center'
  },
  qrCodeContainer: {
    flex: 1,
    marginTop: 30,
    marginLeft: 35,
    marginRight: 35,
    marginBottom: 35,
    backgroundColor: '#F4F4F4',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center'
  },
  walletname: {
    marginTop: 30,
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Bold',
    fontWeight: 'bold',
    color: '#4A4A4A'
  },
  privatekey: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'CourierNewBold',
    fontWeight: Platform.OS === 'ios' ? 'bold' : 'normal',
    color: '#8A8D97',
    textAlign: 'center',
    marginLeft: 18,
    marginRight: 18
  },
  copybt: {
    backgroundColor: '#E5E5E5',
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    paddingLeft: 25,
    paddingRight: 25,
    marginTop: 30
  },
  copy: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Bold',
    fontWeight: 'bold',
    color: '#0A0F24'
  }
})
