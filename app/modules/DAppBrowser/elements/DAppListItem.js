import React, { Component } from 'react'
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Text
} from 'react-native'
import images from '../../../commons/images'

export default class DAppBrowserScreen extends Component {
  render() {
    const {
      title,
      subTitle,
      onPress
    } = this.props
    return (
      <TouchableOpacity style={styles.container}>
        <Image
          source={images.iconEther}
          style={styles.image}
          resizeMode="contain"
        />
        <Text>{title}</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white'
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
})
