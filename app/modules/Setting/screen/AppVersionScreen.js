import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList
} from 'react-native'
import { observer } from 'mobx-react'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import images from '../../../commons/images'
import LayoutUtils from '../../../commons/LayoutUtils'
import SettingItem from '../elements/SettingItem'
import AppVersion from '../../../AppStores/stores/AppVersion'
import NavStore from '../../../AppStores/NavStore'

const marginTop = LayoutUtils.getExtraTop()

const { width } = Dimensions.get('window')

@observer
export default class AppVersionScreen extends Component {
  onPress = (vs) => {
    AppVersion.setChangelogsList(vs)
  }

  onBack = () => {
    NavStore.goBack()
  }

  renderItem = ({ item, index }) =>
    (
      <View>
        <SettingItem
          style={{ borderTopWidth: index === 0 ? 0 : 1, marginTop: index === 0 ? 15 : 0 }}
          mainText={item.version_number}
          type={item.type}
          onPress={() => this.onPress(item.version_number)}
          data={item.change_logs}
          expanse={item.expanse}
        />
      </View>
    )

  renderListVersion = (listVersion) => {
    return (
      <FlatList
        style={{ flex: 1 }}
        data={listVersion}
        keyExtractor={v => v.version_number}
        renderItem={this.renderItem}
      />
    )
  }

  render() {
    const { listVersion } = AppVersion
    return (
      <View style={styles.container}>
        <NavigationHeader
          style={{ marginTop: marginTop + 20, width }}
          headerItem={{
            title: 'App Version',
            icon: null,
            button: images.backButton
          }}
          action={this.onBack}
        />
        {this.renderListVersion(listVersion)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
