import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Dimensions
} from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react/native'
import images from '../../../../commons/images'
import MainStore from '../../../../AppStores/MainStore'
import FooterButton from '../FooterButton'
import AppStyle from '../../../../commons/AppStyle'

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
    const { canGoBack, canGoForward } = MainStore.dapp
    return (
      <View style={[styles.container, style]}>
        <View style={styles.arrowButton}>
          <FooterButton onPress={goBack} icon={images.arrowBack} styleImage={{ tintColor: canGoBack ? 'white' : '#4A4A4A' }} disabled={!canGoBack} />
          <FooterButton onPress={goForward} icon={images.arrowForward} styleImage={{ tintColor: canGoForward ? 'white' : '#4A4A4A' }} style={{ marginLeft: 30 }} disabled={!canGoForward} />
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
    paddingVertical: 15,
    paddingHorizontal: 20,
    width,
    height: 50,
    backgroundColor: AppStyle.backgroundColor
  },
  arrowButton: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})
