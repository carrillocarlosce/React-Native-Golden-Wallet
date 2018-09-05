import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions
} from 'react-native'
import PropTypes from 'prop-types'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import NavStore from '../../../AppStores/NavStore'
import LayoutUtils from '../../../commons/LayoutUtils'
import images from '../../../commons/images'
import CollectibleItem from '../elements/CollectiblesItem'

const { width, height } = Dimensions.get('window')
const marginTop = LayoutUtils.getExtraTop()
const isIPX = height === 812
const extraBottom = isIPX ? 54 : 20

export default class CollectibleListScreen extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }

  onBack = () => NavStore.goBack()

  get collectibles() {
    return this.props.navigation.state.params.collectibles
  }

  _renderItem = ({ item, index }) => {
    const { collectibles } = this
    const marginBottom = index === collectibles.length - 1 ? extraBottom : 0
    return (
      <CollectibleItem index={item.index} style={{ width: width - 40, marginBottom }} />
    )
  }

  render() {
    const { collectibles } = this
    return (
      <View style={styles.container}>
        <NavigationHeader
          style={{ marginTop: 20 + marginTop }}
          headerItem={{
            title: collectibles[0].assetContractName,
            icon: null,
            button: images.backButton
          }}
          action={this.onBack}
        />
        <FlatList
          style={{ flex: 1, alignSelf: 'center', marginBottom: extraBottom }}
          data={collectibles}
          overScrollMode="never"
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `${item.tokenName}-${index}`}
          renderItem={this._renderItem}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
