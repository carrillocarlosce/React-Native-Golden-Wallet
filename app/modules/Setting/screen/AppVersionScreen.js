import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList
} from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import images from '../../../commons/images'
import LayoutUtils from '../../../commons/LayoutUtils'
import SettingItem from '../elements/SettingItem'
import AppVersion from '../../../AppStores/stores/AppVersion'

const marginTop = LayoutUtils.getExtraTop()

const { width } = Dimensions.get('window')

@observer
export default class AppVersionScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }

  onPress = (vs) => {
    AppVersion.setChangelogsList(vs)
  }

  renderAbount = (listVersion) => {
    return (
      <FlatList
        style={{ flex: 1, marginTop: 30 }}
        data={listVersion}
        keyExtractor={v => v.version_number}
        renderItem={({ item, index }) =>
          (
            <View>
              <SettingItem
                style={{ borderTopWidth: index === 0 ? 0 : 1 }}
                mainText={item.version_number}
                type={item.type}
                // subText={item.subText}
                onPress={() => this.onPress(item.version_number)}
                // iconRight={item.iconRight}
                data={item.change_logs}
                expanse={item.expanse}
              // disable={item.disable}
              // showArrow={item.showArrow}
              />
            </View>
          )
        }
      />
    )
  }

  render() {
    const { navigation } = this.props
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
          action={() => {
            navigation.goBack()
          }}
        />
        {this.renderAbount(listVersion)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
