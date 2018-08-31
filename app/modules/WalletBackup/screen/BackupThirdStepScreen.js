import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  SafeAreaView
} from 'react-native'
import { observer } from 'mobx-react/native'
import BottomButton from '../../../components/elements/BottomButton'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import LayoutUtils from '../../../commons/LayoutUtils'
import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'
import NavStore from '../../../AppStores/NavStore'
import TagList from '../elements/TagList'
import MainStore from '../../../AppStores/MainStore'
import { opensansRegular } from '../../../commons/commonStyles'

const { height } = Dimensions.get('window')
const isSmallScreen = height < 569
const isIPX = height === 812

const marginTop = LayoutUtils.getExtraTop()
const content = 'Verify your Recovery Phrase. Choose each word in the correct order.'

@observer
export default class BackupThirdStepScreen extends Component {
  onBack = () => {
    NavStore.popupCustom.show(
      'Confirm!',
      [
        {
          text: 'Leave',
          onClick: () => {
            NavStore.popupCustom.hide()
            NavStore.goBack()
            setTimeout(() => {
              this.backupStore.setup()
            }, 0)
          }
        },
        {
          text: 'Stay',
          onClick: () => {
            NavStore.popupCustom.hide()
          }
        }
      ],
      'Changes you made may not be saved. Are you sure you want to leave?'
    )
  }

  onAddWord = (word, index) => {
    this.backupStore.addWord(word, index)
  }

  onRemoveWord = (word) => {
    this.backupStore.removeWord(word)
  }

  onPress = () => {
    this.backupStore.confirmMnemonic()
  }

  get backupStore() {
    return MainStore.backupStore
  }

  renderListTop = () => {
    const { obj } = this.backupStore
    const { listKeyWordChoose } = obj
    return (
      <TagList
        isCenter
        isShowOrder
        arrayMnemonic={listKeyWordChoose.slice()}
        onItemPress={this.onRemoveWord}
        style={{
          paddingVerticalOfItem: 20,
          numberOfWordInRow: 3,
          marginHorizontal: 10,
          backgroundColor: AppStyle.backgroundContentDarkMode,
          itemBackgroundColor: '#1E2336',
          itemTextColor: AppStyle.mainTextColor,
          fontFamily: opensansRegular,
          fontWeight: 'normal',
          itemFontSize: isSmallScreen ? 12 : 14,
          userInteractionEnabled: true
        }}
      />
    )
  }

  renderListBottom = () => {
    const { obj } = this.backupStore
    const { buttonStates, listKeywordRandom } = obj
    return (
      <TagList
        arrayMnemonic={listKeywordRandom.slice()}
        onItemPress={this.onAddWord}
        isCenter
        buttonStates={buttonStates.slice()}
        style={{
          paddingVerticalOfItem: 10,
          numberOfWordInRow: 3,
          marginHorizontal: 10,
          backgroundDisable: AppStyle.backgroundDarkMode,
          itemBackgroundColor: AppStyle.backgroundContentDarkMode,
          itemTextColor: AppStyle.mainTextColor,
          itemTextColorDisable: '#4A4A4A',
          fontFamily: 'OpenSans-Semibold',
          fontWeight: '500',
          itemFontSize: isSmallScreen ? 12 : 14,
          userInteractionEnabled: true
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
          <View style={styles.content}>
            <Text style={styles.desText}>{content}</Text>
            {this.renderListTop()}
            {this.renderListBottom()}
          </View>
          <BottomButton
            disable={!this.backupStore.isReadyConfirm}
            text="Confirm"
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
  desText: {
    fontSize: isSmallScreen ? 12 : 16,
    color: AppStyle.mainTextColor,
    fontFamily: 'OpenSans-Semibold',
    paddingHorizontal: 20,
    textAlign: 'center'
  },
  content: {
    justifyContent: 'space-between',
    flex: 1,
    marginBottom: isIPX ? 124 : 90
  }
})
