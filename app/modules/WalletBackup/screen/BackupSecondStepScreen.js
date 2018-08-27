import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView
} from 'react-native'
import { observer } from 'mobx-react/native'
import BottomButton from '../../../components/elements/BottomButton'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import LayoutUtils from '../../../commons/LayoutUtils'
import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'
import { opensansRegular } from '../../../commons/commonStyles'
import NavStore from '../../../AppStores/NavStore'
import TagList from '../elements/TagList'
import MainStore from '../../../AppStores/MainStore'

const marginTop = LayoutUtils.getExtraTop()
const mainText = 'Write down your Recovery Phrase in the order and keep it in a secure place.'
const subText = 'Do not share with anyone including Golden support.'

@observer
export default class BackupSecondStepScreen extends Component {
  componentDidMount() {
    setTimeout(() => {
      NavStore.popupCustom.show(
        'Screenshots are not secure!',
        undefined,
        'If you take a screenshot, your Recovery Phrase may be viewed by other apps. You can make a safe backup with physical paper and a pen.',
        undefined,
        undefined,
        undefined,
        undefined,
        images.imageNoScreenShot
      )
    }, 250)
  }

  onBack = () => {
    NavStore.goBack()
  }

  onPress = () => {
    NavStore.popupCustom.show(
      'Confirm!',
      [
        {
          text: 'Cancel',
          onClick: () => {
            NavStore.popupCustom.hide()
          }
        },
        {
          text: 'Next Step',
          onClick: () => {
            NavStore.popupCustom.hide()
            NavStore.pushToScreen('BackupThirdStepScreen')
          }
        }
      ],
      'Are you sure you wrote down your Recovery Phrase in the order and go to next step?'
    )
  }

  renderMnemonic = () => {
    return (
      <TagList
        isShowOrder
        arrayMnemonic={MainStore.backupStore.listMnemonic.slice()}
        style={{
          paddingVerticalOfItem: 20,
          numberOfWordInRow: 3,
          margin: 20,
          marginTop: 20,
          backgroundDisable: AppStyle.colorLines,
          itemTextColorDisable: AppStyle.mainTextColor,
          fontFamily: opensansRegular,
          fontWeight: 'normal',
          itemFontSize: 14,
          userInteractionEnabled: false
        }}
      />
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
              button: images.backButton
            }}
            action={this.onBack}
          />
          <Text style={styles.mainText}>{mainText}</Text>
          {this.renderMnemonic()}
          <Text style={styles.subText}>{subText}</Text>
          <BottomButton
            text="Next Step"
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
  mainText: {
    color: AppStyle.mainTextColor,
    fontSize: 16,
    fontFamily: 'OpenSans-Semibold',
    marginTop: 15,
    paddingHorizontal: 20,
    textAlign: 'center'
  },
  subText: {
    color: AppStyle.secondaryTextColor,
    fontSize: 16,
    fontFamily: opensansRegular,
    marginTop: 15,
    paddingHorizontal: 45,
    textAlign: 'center',
    position: 'absolute',
    bottom: 70 + marginTop,
    alignSelf: 'center'
  }
})
