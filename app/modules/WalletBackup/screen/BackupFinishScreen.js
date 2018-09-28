import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform
} from 'react-native'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'
import constant from '../../../commons/constant'
import HapticHandler from '../../../Handler/HapticHandler'
import MainStore from '../../../AppStores/MainStore'
import LayoutUtils from '../../../commons/LayoutUtils'

const { width } = Dimensions.get('window')
const isIPX = LayoutUtils.getIsIPX()
const marginTop = LayoutUtils.getExtraTop()

const subtext = 'Make sure to keep your Recovery Phrase safely. Be your own bank and take security seriously.'
const maintext = 'Backup Complete! '

export default class CreateWalletScreen extends Component {
  componentDidMount() {
    HapticHandler.NotificationSuccess()
  }

  gotoHome = () => {
    MainStore.backupStore.gotoHome()
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationHeader
          style={{ marginTop: marginTop + 20, width }}
          headerItem={{
            title: null,
            icon: null,
            button: images.closeButton
          }}
          action={this.gotoHome}
        />
        <Image
          source={images.imgLock}
        />
        <Text style={styles.maintext}>{maintext}</Text>
        <Text style={styles.textDes}>{subtext}</Text>
        <View style={{ position: 'absolute', left: 20, bottom: isIPX ? 40 : 20 }}>
          <TouchableOpacity
            style={styles.buttonGotIt}
            onPress={this.gotoHome}
          >
            <Text style={styles.textGotIt}>
              {constant.GOT_IT}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1
  },
  maintext: {
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
    color: AppStyle.mainTextColor,
    marginTop: 20
  },
  textDes: {
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
    color: AppStyle.secondaryTextColor,
    paddingHorizontal: 30,
    textAlign: 'center',
    marginTop: 40
  },
  buttonGotIt: {
    width: width - 40,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: '#121734'
  },
  textGotIt: {
    fontFamily: 'OpenSans-Semibold',
    fontSize: 18,
    color: AppStyle.mainColor
  }
})
