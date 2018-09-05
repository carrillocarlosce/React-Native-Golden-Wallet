import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Image,
  Text,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native'
import PropTypes from 'prop-types'
import MainStore from '../../../AppStores/MainStore'
import AppStyle from '../../../commons/AppStyle'
import { opensansRegular } from '../../../commons/commonStyles'
import NavStore from '../../../AppStores/NavStore'

const { width } = Dimensions.get('window')

export default class CollectibleItem extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    style: PropTypes.object
  }

  static defaultProps = {
    style: {}
  }

  onItemPress = () => {
    const { index } = this.props
    NavStore.pushToScreen('CollectibleDetailScreen', { index })
  }

  get collectible() {
    const { index } = this.props
    return MainStore.appState.selectedWallet.collectibles[index]
  }

  render() {
    const {
      tokenName, tokenDescription, thumnail, backgroundColor
    } = this.collectible
    const { style } = this.props
    return (
      <TouchableWithoutFeedback onPress={this.onItemPress}>
        <View style={[styles.container, style]}>
          <View style={[styles.backgroundImage, { backgroundColor }]}>
            <Image style={{ height: 80, width: 80 }} source={{ uri: thumnail }} />
          </View>
          <View style={{ marginHorizontal: 10, flex: 1 }}>
            <Text style={styles.name}>{tokenName}</Text>
            <Text
              style={styles.des}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {tokenDescription}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    width: width - 65,
    marginTop: 15,
    overflow: 'hidden'
  },
  backgroundImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  name: {
    color: AppStyle.mainTextColor,
    fontSize: 16,
    fontFamily: 'OpenSans-Semibold'
  },
  des: {
    fontFamily: opensansRegular,
    fontSize: 14,
    color: AppStyle.secondaryTextColor,
    marginTop: 6
  }
})
