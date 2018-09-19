import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Dimensions
} from 'react-native'
import { observer } from 'mobx-react/native'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import SmallCard from '../../../components/elements/SmallCard'
import LayoutUtils from '../../../commons/LayoutUtils'
import constant from '../../../commons/constant'
import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'
import NavStore from '../../../AppStores/NavStore'

const marginTop = LayoutUtils.getExtraTop()
const { width } = Dimensions.get('window')

@observer
export default class CreateWalletScreen extends Component {
  goBack = () => {
    NavStore.goBack()
  }

  gotoEnterName = () => {
    NavStore.pushToScreen('WalletTypeCreateScreen')
  }

  gotoImport = () => {
    NavStore.pushToScreen('WalletTypeImportScreen')
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationHeader
          style={{ marginTop: marginTop + 20 }}
          headerItem={{
            title: constant.CREATE_NEW_WALLET,
            icon: null,
            button: images.closeButton
          }}
          action={this.goBack}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <SmallCard
            title="Create"
            subtitle="a new wallet"
            imageCard={images.imgCardCreate}
            onPress={this.gotoEnterName}
            imageBackground="backgroundCard"
            titleTextStyle={{ color: AppStyle.mainColor }}
            subtitleTextStyle={{ color: AppStyle.secondaryTextColor, marginTop: 4, fontSize: 16 }}
          />

          <SmallCard
            style={{ marginTop: 40 }}
            title="Import"
            subtitle="existing wallet"
            imageCard={images.imgCardImport}
            onPress={this.gotoImport}
            imgBackground="backgroundCard"
            imgBackgroundStyle={{ height: 214, borderRadius: 14, width: width - 40 }}
            titleTextStyle={{ color: AppStyle.mainTextColor }}
            subtitleTextStyle={{ color: AppStyle.secondaryTextColor, marginTop: 4, fontSize: 16 }}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
