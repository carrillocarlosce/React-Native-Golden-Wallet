import React, { PureComponent } from 'react'
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Image
} from 'react-native'
import PropTypes from 'prop-types'

export default class FooterButton extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    style: PropTypes.object,
    styleImage: PropTypes.object,
    icon: PropTypes.number.isRequired
  }

  static defaultProps = {
    style: {},
    styleImage: {}
  }

  render() {
    const {
      onPress, style, styleImage, icon
    } = this.props
    return (
      <TouchableOpacity onPress={onPress} style={style}>
        <View style={[styles.container]}>
          <Image style={styleImage} source={icon} />
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
