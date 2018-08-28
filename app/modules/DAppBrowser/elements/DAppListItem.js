import React, { Component } from 'react'
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  View
} from 'react-native'
import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'

export default class DAppListItem extends Component {
  render() {
    const {
      title,
      subTitle,
      onPress,
      line
    } = this.props
    return (
      <View style={{ backgroundColor: AppStyle.backgroundTextInput }}>
        {line && <View style={styles.line} />}

        <TouchableOpacity style={styles.container}>
          <Image
            source={images.iconEther}
            style={styles.image}
            resizeMode="contain"
          />
          <View style={styles.viewStyle}>
            <Text style={styles.titleStyle}>{title}</Text>
            <Text style={styles.subTitleStyle}>{subTitle}</Text>
          </View>
          <Image
            style={{ alignSelf: 'center' }}
            source={images.icon_indicator}
          />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 105,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 15
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  viewStyle: {
    flex: 1,
    marginRight: 10,
    marginLeft: 10,
    height: 50,
    justifyContent: 'space-between'
  },
  titleStyle: {
    color: AppStyle.backgroundGrey,
    fontSize: 16,
    fontFamily: 'OpenSans-Semibold'
  },
  subTitleStyle: {
    color: AppStyle.secondaryTextColor,
    fontSize: 14,
    fontFamily: 'OpenSans',
    marginTop: 5
  },
  line: {
    height: 1,
    backgroundColor: AppStyle.secondaryTextColor,
    marginLeft: 80,
    marginRight: 20
  }
})
