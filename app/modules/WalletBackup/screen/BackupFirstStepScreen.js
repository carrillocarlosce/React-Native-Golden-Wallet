import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Image,
  Text,
  SafeAreaView
} from 'react-native'
import BottomButton from '../../../components/elements/BottomButton'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import LayoutUtils from '../../../commons/LayoutUtils'
import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'
import { opensansRegular } from '../../../commons/commonStyles'
import NavStore from '../../../AppStores/NavStore'

const marginTop = LayoutUtils.getExtraTop()
const content = [
  'The Recovery Phrase will allow you to recover your wallet in case of the phone loss.',
  'Golden cannot restore it once lost, so please keep it safe.',
  'Anyone with your Recovery Phrase can restore and controls all your assets.'
]

export default class BackupFirstStepScreen extends Component {
  onBack = () => {
    NavStore.goBack()
  }

  onPress = () => {
    NavStore.pushToScreen('BackupSecondStepScreen')
  }

  renderContent = (des, style) => {
    return (
      <View style={[styles.containerContent, style]}>
        <View style={styles.dot} />
        <Text style={styles.des}>{des}</Text>
      </View>
    )
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
            action={this.onBack}
          />
          <Image style={styles.image} source={images.backupNoteBook} />
          <Text style={styles.attention}>No backup, No wallet!</Text>
          {this.renderContent(content[0], { marginTop: 40 })}
          {this.renderContent(content[1], { marginTop: 30 })}
          {this.renderContent(content[2], { marginTop: 30 })}
          <BottomButton
            text="Got it"
            onPress={this.onPress}
          />
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  containerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: AppStyle.secondaryTextColor
  },
  des: {
    fontSize: 15,
    fontFamily: opensansRegular,
    color: AppStyle.secondaryTextColor,
    marginLeft: 8
  },
  attention: {
    color: AppStyle.mainTextColor,
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
    marginTop: 20,
    alignSelf: 'center'
  },
  image: { alignSelf: 'center', marginLeft: 55, marginTop: 15 }
})
