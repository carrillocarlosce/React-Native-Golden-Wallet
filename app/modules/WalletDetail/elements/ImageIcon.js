import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image,
  Platform
} from 'react-native'
import PropTypes from 'prop-types'
import Helper from '../../../commons/Helper'
import images from '../../../commons/images'
import MainStore from '../../../AppStores/MainStore'
import AppStyle from '../../../commons/AppStyle'

export default class ImageIcon extends Component {
  static propTypes = {
    indexToken: PropTypes.number.isRequired
  }

  state = {
    imageNotFound: true
  }

  get token() {
    const { indexToken } = this.props
    return this.wallet.tokens[indexToken]
  }

  get wallet() {
    return MainStore.appState.selectedWallet
  }

  render() {
    const { symbol } = this.token
    const firstCharacter = symbol.toUpperCase().substring(0, 1)
    const iconImage = { uri: Helper.getIconCoin(symbol), cache: 'force-cache' }
    const { imageNotFound } = this.state
    if (symbol === 'ETH') {
      return (
        <Image
          source={images.iconEther}
          style={styles.image}
          resizeMode="contain"
        />
      )
    }
    return (
      <View style={styles.iconField}>
        <View
          style={[
            styles.iconField,
            { backgroundColor: '#0E1428', position: 'absolute', opacity: imageNotFound ? 1 : 0 }
          ]}
        >
          <Text style={styles.iconText}>{firstCharacter}</Text>
        </View>
        <Image
          source={iconImage}
          style={{
            width: 50,
            height: 50,
            position: 'absolute',
            opacity: imageNotFound ? 0 : 1
          }}
          onProgress={() => this.setState({ imageNotFound: false })}
          onLoad={() => {
            Platform.OS === 'android' && this.setState({ imageNotFound: false })
          }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  iconField: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconText: {
    color: 'white',
    fontSize: 24,
    fontFamily: AppStyle.mainFontSemiBold
  }
})
