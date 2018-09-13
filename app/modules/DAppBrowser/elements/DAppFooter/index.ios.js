import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Dimensions
} from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react/native'
import images from '../../../../commons/images'
import FooterButton from '../FooterButton'

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
          <FooterButton onPress={goBack} icon={images.arrowBack} styleImage={{ tintColor: 'white' }} />
          <FooterButton onPress={goForward} icon={images.arrowForward} styleImage={{ tintColor: 'white' }} style={{ marginLeft: 30 }} />
        </View>
        <FooterButton onPress={onReload} icon={images.iconRefresh} styleImage={{ tintColor: 'white' }} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width,
    height: 50
  },
  arrowButton: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})
