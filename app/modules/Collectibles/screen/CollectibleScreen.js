import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions
} from 'react-native'
// import PropTypes from 'prop-types'

import { observer } from 'mobx-react/native'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import images from '../../../commons/images'
import LayoutUtils from '../../../commons/LayoutUtils'
import NavStore from '../../../AppStores/NavStore'
import MainStore from '../../../AppStores/MainStore'
import Spinner from '../../../components/elements/Spinner'
import EmptyCollectibles from '../elements/EmptyCollectibles'
import CollectibleCarousel from '../elements/CollectibleCarousel'

const marginTop = LayoutUtils.getExtraTop()
const { width } = Dimensions.get('window')

@observer
export default class CollectibleScreen extends Component {
  static propTypes = {

  }

  static defaultProps = {

  }

  componentDidMount() {
    this.wallet.fetchCollectibles()
  }

  onBack = () => NavStore.goBack()

  onSeeMorePress = (index) => {
    NavStore.pushToScreen('CollectibleListScreen', {
      collectibles: this.wallet.collectiblesSeparate[index]
    })
  }

  get wallet() {
    return MainStore.appState.selectedWallet
  }

  _renderNoCollectibleView = () => {
    if (this.wallet.isFetchingCollectibles) return <View key="invisible" />
    return <EmptyCollectibles />
  }

  _renderItemCarousel = ({ item, index }) =>
    (
      <CollectibleCarousel
        item={item}
        index={index}
        onSeeMorePress={this.onSeeMorePress}
      />
    )

  render() {
    const { isFetchingCollectibles, collectiblesChunk } = this.wallet
    return (
      <View style={styles.container}>
        <NavigationHeader
          style={{ marginTop: 20 + marginTop }}
          headerItem={{
            title: 'Collectibles',
            icon: null,
            button: images.backButton
          }}
          action={this.onBack}
        />
        <FlatList
          style={{ flex: 1 }}
          contentContainerStyle={[{}, collectiblesChunk.length ? { width } : { flexGrow: 1, justifyContent: 'center' }]}
          ListEmptyComponent={this._renderNoCollectibleView()}
          data={collectiblesChunk}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, i) => `${i}`}
          renderItem={this._renderItemCarousel}
        />
        {isFetchingCollectibles &&
          <Spinner />
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
