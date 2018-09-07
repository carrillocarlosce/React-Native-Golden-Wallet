import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native'
import PropTypes from 'prop-types'
import images from '../../../commons/images'

const { width } = Dimensions.get('window')

export default class DAppFooter extends Component {
  static propTypes = {
    style: PropTypes.number,
    onBack: PropTypes.func,
    onForward: PropTypes.func,
    onReload: PropTypes.func
  }

  static defaultProps = {
    style: 0,
    onBack: () => { },
    onForward: () => { },
    onReload: () => { }
  }

  render() {
    const {
      style, onBack, onForward, onReload
    } = this.props
    return (
      <View style={[styles.container, style]}>
        <View style={styles.arrowButton}>
          <TouchableOpacity onPress={onBack}>
            <Image source={images.arrowBack} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onForward} style={{ marginLeft: 70 }}>
            <Image source={images.arrowForward} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={onReload}>
          <Image source={images.iconRefresh} />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    width
  },
  arrowButton: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})
