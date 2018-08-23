import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  StatusBar,
  Text,
  Animated,
  TouchableOpacity,
  BackHandler,
  Platform
} from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react/native'
import images from '../../commons/images'
/* eslint-disable-next-line */
import GoldenLoading from '../../components/elements/GoldenLoading'
import UnlockStore from './UnlockStore'
import NavStore from '../../AppStores/NavStore'
import DisableView from './elements/DisableView'
import AppStyle from '../../commons/AppStyle'

const { height } = Dimensions.get('window')
const isSmallScreen = height < 569
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
    actions: 'cancel'
  },
  { number: '0' },
  {
    icon: images.imgDeletePin,
    actions: 'delete'
  }
]

@observer
export default class UnlockScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }

  constructor(props) {
    super(props)
    this.animatedValue = new Animated.Value(0)
    this.isShake = false
  }

  componentDidMount() {
    UnlockStore.setup()
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
    }
  }

  get shouldShowDisableView() {
    const { wrongPincodeCount, timeRemaining } = UnlockStore
    return wrongPincodeCount > 5 && timeRemaining > 0
  }

  handleBackPress = () => {
    BackHandler.exitApp()
    return true
  }

  renderDots(numberOfDots) {
    const dots = []
    const { pincode } = UnlockStore.data
    const pinTyped = pincode.length

    const styleDot = {
      width: 13,
      height: 13,
      borderRadius: 6.5,
      borderWidth: 1,
      borderColor: 'white',
      marginHorizontal: 12
    }
    for (let i = 0; i < numberOfDots; i++) {
      const backgroundColor = i < pinTyped ? { backgroundColor: 'white' } : {}
      const dot = <View style={[styleDot, backgroundColor]} key={i} />
      dots.push(dot)
    }
    return dots
  }

  renderNumber(arrayNumber) {
    const { onUnlock = () => { }, shouldShowCancel } = this.props.navigation.state.params
    const nums = arrayNumber.map((num, i) => {
      if (num.number) {
        return (
          <TouchableOpacity
            onPress={() => {
              UnlockStore.handlePress(num.number).then(res => onUnlock(res))
            }}
            key={num.number}
          >
            <View style={styles.numberField}>
              <Text style={styles.numberText}>{num.number}</Text>
            </View>
          </TouchableOpacity>
        )
      }

      return (
        <TouchableOpacity
          key={num.actions}
          onPress={() => {
            if (num.actions === 'delete') {
              UnlockStore.handleDeletePin()
            } else if (num.actions === 'cancel' && shouldShowCancel) {
              NavStore.goBack()
            }
          }}
        >
          <View style={styles.numberField}>
            {num.actions !== 'cancel' &&
              <Image
                source={num.icon}
              />
            }
            {num.actions === 'cancel' &&
              <Text style={styles.cancelText}>Cancel</Text>
            }
          </View>
        </TouchableOpacity>
      )
    })

    return (
      <View style={styles.arrayNumber}>
        {nums}
      </View>
    )
  }

  renderContent = (unlockDescription, warningPincodeFail) => {
    if (this.shouldShowDisableView) {
      return <DisableView />
    }

    const animationShake = UnlockStore.animatedValue.interpolate({
      inputRange: [0, 0.3, 0.7, 1],
      outputRange: [0, -20, 20, 0],
      useNativeDriver: true
    })
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text style={styles.desText}>{unlockDescription}</Text>
        {warningPincodeFail &&
          <Text style={styles.warningField}>{warningPincodeFail}</Text>
        }
        <Animated.View
          style={[styles.pinField, {
            transform: [
              {
                translateX: animationShake
              }
            ]
          }]}
        >
          {this.renderDots(6)}
        </Animated.View>
        <View style={{ marginTop: isSmallScreen ? 10 : height * 0.03 }}>
          {this.renderNumber(dataNumber1)}
          {this.renderNumber(dataNumber2)}
          {this.renderNumber(dataNumber3)}
          {this.renderNumber(dataNumber4)}
        </View>
      </View>
    )
  }

  render() {
    const { shouldShowDisableView } = this
    const { warningPincodeFail } = UnlockStore
    const unlockDescription = UnlockStore.data.unlockDes
    const container = shouldShowDisableView ? {} : { justifyContent: 'center' }
    return (
      <View style={[styles.container, container]}>
        <StatusBar
          hidden
        />
        <GoldenLoading
          style={{ marginTop: shouldShowDisableView ? 80 : 0 }}
          isSpin={false}
        />
        {this.renderContent(unlockDescription, warningPincodeFail)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1
  },
  desText: {
    color: 'white',
    fontSize: isSmallScreen ? 14 : 22,
    fontFamily: 'OpenSans-Bold',
    marginTop: isSmallScreen ? 10 : height * 0.03,
    marginBottom: isSmallScreen ? 8 : height * 0.015
  },
  pinField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: isSmallScreen ? 13 : height * 0.025
  },
  arrayNumber: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.02
  },
  numberField: {
    width: isSmallScreen ? 60 : 75,
    height: isSmallScreen ? 60 : 75,
    borderRadius: 37.5,
    // backgroundColor: AppStyle.colorPinCode,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 13
  },
  numberText: {
    fontFamily: 'OpenSans-Semibold',
    fontSize: 36,
    color: 'white'
  },
  cancelText: {
    fontFamily: 'OpenSans-Semibold',
    fontSize: isSmallScreen ? 18 : 20,
    color: 'white'
  },
  warningField: {
    color: AppStyle.errorColor,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 16
  }
})
