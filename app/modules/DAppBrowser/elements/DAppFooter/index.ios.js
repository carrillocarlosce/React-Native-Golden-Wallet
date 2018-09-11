import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react/native'
import images from '../../../../commons/images'

const { width } = Dimensions.get('window')

@observer
export default class DAppFooter extends Component {
  static propTypes = {
    style: PropTypes.number,
    goBack: PropTypes.func,
    goForward: PropTypes.func,
    onReload: PropTypes.func
  }

  static defaultProps = {
    style: 0,
    goBack: () => { },
    goForward: () => { },
    onReload: () => { }
  }

  render() {
    const {
      style, goBack, goForward, onReload
    } = this.props

    return (
      <View style={[styles.container, style]}>
        <View style={styles.arrowButton}>
          <TouchableOpacity onPress={goBack}>
            <Image source={images.arrowBack} style={{ tintColor: 'white' }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={goForward} style={{ marginLeft: 70 }}>
            <Image source={images.arrowForward} style={{ tintColor: 'white' }} />
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
