import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Image,
  Text,
  Dimensions,
  SafeAreaView
} from 'react-native'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import LayoutUtils from '../../../commons/LayoutUtils'
import images from '../../../commons/images'
import NavStore from '../../../AppStores/NavStore'
import BottomButton from '../../../components/elements/BottomButton'
import AppStyle from '../../../commons/AppStyle'
import { opensansRegular } from '../../../commons/commonStyles'

const { height } = Dimensions.get('window')
const marginTop = LayoutUtils.getExtraTop()
const mainText = 'Your data is deleted!'
const subText = 'Someone has kept guessing your PIN to unauthorized access to your wallet. To ensure the safety of your funds, we have destroyed all data on Golden. Now create a new PIN Code to continue using.'

export default class EnraseNotifScreen extends Component {
  goBack = () => {
    NavStore.goBack()
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <NavigationHeader
            style={{ marginTop: marginTop + 20 }}
            headerItem={{
              title: null,
              icon: null,
              button: images.closeButton
            }}
            action={this.goBack}
          />
          <Image source={images.imgEnrase} style={styles.imgEnrase} />
          <Text style={styles.mainText}>{mainText}</Text>
          <Text style={styles.subText}>{subText}</Text>
          <BottomButton Text="Create new PIN Code" onPress={this.goBack} />
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  imgEnrase: {
    marginTop: height * 0.06,
    alignSelf: 'center',
    height: height * 0.22,
    resizeMode: 'contain'
  },
  mainText: {
    color: AppStyle.mainTextColor,
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
    marginTop: height * 0.1,
    alignSelf: 'center'
  },
  subText: {
    color: AppStyle.secondaryTextColor,
    fontSize: 16,
    fontFamily: opensansRegular,
    marginTop: height * 0.036,
    paddingHorizontal: 30,
    textAlign: 'center'
  }
})
