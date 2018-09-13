import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  Image,
  Text
} from 'react-native'
import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'
import { opensansRegular } from '../../../commons/commonStyles'

export default class CreateWalletScreen extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <Image source={images.imgEmptyBox} />
        <Text style={styles.mainText}>Nothing here.</Text>
        <Text style={styles.subText}>You don’t have any collectibles.</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  mainText: {
    color: AppStyle.mainTextColor,
    fontSize: 18,
    fontFamily: 'OpenSans-Semibold',
    marginTop: 40
  },
  subText: {
    color: AppStyle.secondaryTextColor,
    fontSize: 15,
    fontFamily: opensansRegular,
    marginTop: 10
  }
})
