import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import AnimationInputItem from '../elements/AnimationInputItem'
import AppStyle from '../../../commons/AppStyle'
import images from '../../../commons/images'
import { observer } from '../../../../node_modules/mobx-react'
import MainStore from '../../../AppStores/MainStore'

const dataRef = {}

@observer
export default class AnimationInput extends Component {
  static propTypes = {
    data: PropTypes.object,
    subData: PropTypes.string,
    postfix: PropTypes.string
  }

  static defaultProps = {
    data: {},
    subData: '',
    postfix: 'ETH'
  }

  _onTogglePress = () => this.amountStore.toggle()

  render() {
    this.amountStore = MainStore.sendTransaction.amountStore
    this.confirmStore = MainStore.sendTransaction.confirmStore
    const {
      data,
      subData,
      isUSD
    } = this.props.data
    const string = 'Included network fee'
    const style = {
      fontFamily: 'OpenSans-Semibold',
      color: data.length == 0 ? AppStyle.greyTextInput : AppStyle.mainTextColor,
      fontSize: this.amountStore.checkSmallSize ? 40 : 60
    }
    const prefixTitle = isUSD
      ? <Text style={style}>$</Text>
      : null
    const postfixTitle = !isUSD
      ? <Text style={[{ marginLeft: 15 }, style]}>{this.props.postfix}</Text>
      : null
    const warningTitle = this.amountStore.checkWarningTitle
      ? <Text style={styles.waringStyle}>Not enough balance for network fee</Text>
      : null
    const warningFee = this.amountStore.checkMaxBalanceWithFee
      ? <Text style={styles.waringFeeStyle}>{string}</Text>
      : null
    const textInit = data.length == 0
      ? <Text style={styles.textInit}>{isUSD ? '0' : '0.0'}</Text>
      : null
    return (
      <View style={{ justifyContent: 'center' }}>
        <View style={styles.inputField}>
          {prefixTitle}
          {textInit}
          {data.map((item, index) => {
            const { text = '', animated = true } = item
            return (
              <AnimationInputItem
                key={`${index}`}
                sizeSmall={this.amountStore.checkSmallSize}
                ref={ref => (dataRef[index] = ref)}
                text={text}
                animated={animated}
              />
            )
          })}
          {subData.map((item, index) => {
            const { text = '', animated = true } = item
            return (
              <AnimationInputItem
                sub={true}
                key={`${index}`}
                sizeSmall={this.amountStore.checkSmallSize}
                ref={ref => (dataRef[index] = ref)}
                text={text}
                animated={animated}
              />
            )
          })}
          {postfixTitle}
        </View>
        <View
          style={{ justifyContent: 'center', flexDirection: 'row', height: 60 }}
        >
          <View>
            <Text style={[styles.subTitle, { color: data.length == 0 ? AppStyle.greyTextInput : AppStyle.secondaryTextColor }]}>
              {this.props.subData}
            </Text>
            {warningTitle || warningFee}
          </View>
          <TouchableOpacity
            style={styles.changeButton}
            onPress={this._onTogglePress}
          >
            <Image
              source={images.exchangeIcon}
              style={{ width: 30, height: 30 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  changeButton: {
    right: 30,
    top: 0,
    position: 'absolute',
    marginTop: 15
  },
  subTitle: {
    alignSelf: 'center',
    marginTop: 10,
    fontSize: 20
  },
  inputField: {
    flexDirection: 'row',
    alignSelf: 'center',
    height: 70,
    alignItems: 'flex-end'
  },
  waringStyle: {
    color: '#D0021B',
    alignSelf: 'center',
    fontSize: 14,
    marginTop: 10,
    fontFamily: 'OpenSans-Semibold'
  },
  textInit: {
    color: AppStyle.greyTextInput,
    fontSize: 60,
    fontFamily: 'OpenSans-Semibold'
  },
  waringFeeStyle: {
    color: AppStyle.grayColor,
    alignSelf: 'center',
    fontSize: 14,
    marginTop: 10,
    fontFamily: 'OpenSans-Semibold'
  }
})
