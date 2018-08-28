import React, { Component } from 'react'
import {
  StyleSheet,
  View
} from 'react-native'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import NavStore from '../../../AppStores/NavStore'
import images from '../../../commons/images'
import LayoutUtils from '../../../commons/LayoutUtils'
import DAppListItem from '../elements/DAppListItem'

const marginTop = LayoutUtils.getExtraTop()

export default class DAppListScreen extends Component {
  onBack = () => NavStore.goBack()

  render() {
    return (
      <View style={styles.container}>
        <NavigationHeader
          style={{ marginTop: 20 + marginTop }}
          headerItem={{
            title: 'DApp Browser',
            icon: null,
            button: images.backButton
          }}
          action={this.onBack}
        />
        <View>
          <DAppListItem />
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
