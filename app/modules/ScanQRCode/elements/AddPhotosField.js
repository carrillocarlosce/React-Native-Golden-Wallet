import React, { PureComponent } from 'react'
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native'
import PropsType from 'prop-types'
import AppStyle from '../../../commons/AppStyle'
import images from '../../../commons/images'
import constants from '../../../commons/constant'

const { width } = Dimensions.get('window')
const heightBottomView = (width * 65) / 375

export default class AddPhotosField extends PureComponent {
  static propTypes = {
    onPress: PropsType.func
  }

  static defaultProps = {
    onPress: () => { }
  }
  render() {
    const {
      onPress = () => { }
    } = this.props

    return (
      <TouchableWithoutFeedback
        onPress={onPress}
      >
        <View
          style={styles.buttonBlue}
        >
          <Image
            source={images.iconAddPhoto}
          />
          <Text style={styles.textButtonBlue}>
            {constants.ADD_FROM_ALBUM}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  buttonBlue: {
    width,
    height: heightBottomView,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  textButtonBlue: {
    marginLeft: 6,
    fontFamily: 'OpenSans-Light',
    fontSize: 14,
    color: AppStyle.mainTextColor
  }
})
