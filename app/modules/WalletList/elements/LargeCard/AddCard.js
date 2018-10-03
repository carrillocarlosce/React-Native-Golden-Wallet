import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  Text,
  Dimensions
} from 'react-native'
import PropTypes from 'prop-types'
import AppStyle from '../../../../commons/AppStyle'
import images from '../../../../commons/images'
import LayoutUtils from '../../../../commons/LayoutUtils'

const { width, height } = Dimensions.get('window')
const marginTop = LayoutUtils.getExtraTop()
const cardWidth = width - 72 - 10
const cardHeight = height - 200 - marginTop - 5

export default class AddCard extends Component {
  static propTypes = {
    onPress: PropTypes.func
  }

  static defaultProps = {
    onPress: () => { }
  }

  render() {
    const { onPress } = this.props
    return (
      <TouchableWithoutFeedback
        style={[styles.container]}
        onPress={onPress}
      >
        <View style={[styles.container, { marginTop: 20, margin: 5 }]}>
          <Image
            style={styles.bgImage}
            source={images.background_add_wallet}
            resizeMode="stretch"
          />
          <Image
            style={{ marginTop: cardHeight * 0.35 }}
            source={images.iconLargeAdd}
          />
          <Text
            style={styles.addText}
          >
            Add new wallet
          </Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    height: cardHeight,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10
  },
  bgImage: {
    height: cardHeight, width: cardWidth, position: 'absolute', borderRadius: 14
  },
  addText: {
    color: AppStyle.mainColor,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 20,
    marginTop: cardHeight * 0.08
  }
})
