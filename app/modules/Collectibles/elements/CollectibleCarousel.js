import React, { PureComponent } from 'react'
import {
  Dimensions,
  FlatList,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform
} from 'react-native'
import PropTypes from 'prop-types'
import Carousel from 'react-native-snap-carousel'
import CollectibleItem from '../elements/CollectiblesItem'
import AppStyle from '../../../commons/AppStyle'

const { width } = Dimensions.get('window')

export default class CollectiblesCarousel extends PureComponent {
  static propTypes = {
    item: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    onSeeMorePress: PropTypes.func
  }

  static defaultProps = {
    onSeeMorePress: () => { }
  }

  onSeeMorePress = () => {
    const { onSeeMorePress, index } = this.props
    onSeeMorePress(index)
  }

  _renderItem = ({ item }) =>
    (
      <CollectibleItem index={item.index} />
    )

  _renderCollectibles = ({ item }) =>
    (
      <FlatList
        style={{ flex: 1, marginLeft: Platform.OS === 'ios' ? -10 : 0 }}
        data={item}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(itemCollectible, i) => `${itemCollectible.tokenName}-${i}`}
        renderItem={this._renderItem}
      />
    )

  render() {
    const { item, index } = this.props
    return (
      <View style={styles.container}>
        <View style={[styles.header, { marginTop: index === 0 ? 15 : 20 }]}>
          <Text style={styles.title}>{item[0][0].assetContractName}</Text>
          <TouchableOpacity onPress={this.onSeeMorePress}>
            <Text style={styles.button}>See More</Text>
          </TouchableOpacity>
        </View>
        <Carousel
          removeClippedSubviews={false}
          ref={(c) => { this._carousel = c }}
          data={item}
          renderItem={this._renderCollectibles}
          sliderWidth={width}
          itemWidth={width - 60}
          inactiveSlideOpacity={1}
          keyExtractor={(_, indexCarousel) => `${indexCarousel}`}
          inactiveSlideScale={1}
          onSnapToItem={this.onSnapToItem}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 15
  },
  title: {
    color: AppStyle.mainTextColor,
    fontSize: 16,
    fontFamily: 'OpenSans-Semibold'
  },
  button: {
    color: AppStyle.mainColor,
    fontSize: 14,
    fontFamily: 'OpenSans-Semibold'
  }
})
