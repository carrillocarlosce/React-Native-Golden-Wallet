import React, { Component } from 'react'
import {
  Animated,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  Dimensions
} from 'react-native'
import debounce from 'lodash.debounce'
import HapticHandler from '../../../Handler/HapticHandler'
import images from '../../../commons/images'
import MainStore from '../../../AppStores/MainStore'
import KeyBoardButton from './KeyboardButton'

const { height } = Dimensions.get('window')
const isSmallScreen = height < 650

const dataNumber1 = [
  { number: '1' },
  { number: '2' },
  { number: '3' }
]
const dataNumber2 = [
  { number: '4' },
  { number: '5' },
  { number: '6' }
]
const dataNumber3 = [
  { number: '7' },
  { number: '8' },
  { number: '9' }
]
const dataNumber4 = [
  {
    number: '.'
  },
  { number: '0' },
  {
    icon: images.imgDeletePin,
    actions: 'delete'
  }
]

export default class KeyBoard extends Component {
  constructor(props) {
    super(props)
    this.amountStore = MainStore.sendTransaction.amountStore
  }

  _onMaxPress = () => {
    this.amountStore.max()
  }
  _onKeyPress = debounce((text) => {
    HapticHandler.ImpactLight()
    this.amountStore.add({ text })
  }, 0)

  _onBackPress = debounce(() => {
    this.amountStore.remove()
  }, 0)

  _onLongPress = debounce(() => {
    this.amountStore.clearAll()
  }, 0)

  renderNumber(arrayNumber) {
    const nums = arrayNumber.map((num, i) => {
      if (num.number) {
        return (
          <KeyBoardButton
            key={`${num.number}`}
            style={styles.numberField}
            content={num.number}
            contentStyle={styles.numberText}
            onPress={() => this._onKeyPress(num.number)}
          />
        )
      }
      return (
        <TouchableOpacity
          key={num.actions}
          onLongPress={() => {
            this._onLongPress()
          }}
          onPress={() => {
            HapticHandler.ImpactLight()
            if (num.actions === 'delete') {
              this._onBackPress()
            }
          }}
        >
          <Animated.View style={styles.numberField} >
            <Image
              source={num.icon}
            />
          </Animated.View >
        </TouchableOpacity>
      )
    })

    return (
      <View style={styles.arrayNumber}>
        {nums}
      </View>
    )
  }

  render() {
    return (
      <View
        style={styles.keyboard}
      >
        <TouchableOpacity
          style={styles.maxButton}
          onPress={this._onMaxPress}
        >
          <Text style={{ fontSize: 16, color: '#4A90E2', fontFamily: 'OpenSans-Semibold' }}>Max</Text>
        </TouchableOpacity>
        {this.renderNumber(dataNumber1)}
        {this.renderNumber(dataNumber2)}
        {this.renderNumber(dataNumber3)}
        {this.renderNumber(dataNumber4)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  keyboard: {
    marginLeft: 30,
    marginRight: 30
  },
  maxButton: {
    height: 40,
    paddingLeft: 32,
    paddingRight: 32,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#0E1428',
    marginBottom: 10
  },
  numberField: {
    width: isSmallScreen ? 65 : 75,
    height: isSmallScreen ? 65 : 75,
    // borderRadius: 37.5,
    // backgroundColor: AppStyle.colorPinCode,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 13
  },
  numberText: {
    // fontFamily: 'OpenSans-Semibold',
    fontSize: 30,
    color: 'white'
  },
  arrayNumber: {
    flexDirection: 'row',
    justifyContent: 'space-between'
    // marginTop: height * 0.01
  }
})
