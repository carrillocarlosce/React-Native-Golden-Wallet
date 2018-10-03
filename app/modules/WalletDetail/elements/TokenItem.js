import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform
} from 'react-native'
import PropsTypes from 'prop-types'
import { observer } from 'mobx-react/native'
import AppStyle from '../../../commons/AppStyle'
import Helper from '../../../commons/Helper'
import FadeText from './FadeText'
import MainStore from '../../../AppStores/MainStore'
import ImageIcon from './ImageIcon'

@observer
export default class TokenItem extends Component {
  static propTypes = {
    indexToken: PropsTypes.number.isRequired,
    style: PropsTypes.object,
    styleUp: PropsTypes.object,
    onPress: PropsTypes.func
  }

  static defaultProps = {
    style: null,
    styleUp: null,
    onPress: () => { }
  }

  get token() {
    const { indexToken } = this.props
    return this.wallet.tokens[indexToken]
  }

  get wallet() {
    return MainStore.appState.selectedWallet
  }

  render() {
    const {
      style,
      styleUp,
      onPress,
      indexToken
    } = this.props

    const {
      title, symbol, balanceToken, balanceInDollar
    } = this.token

    const { isHideValue } = this.wallet

    return (
      <TouchableOpacity onPress={onPress}>
        <View style={[styles.container, style]}>
          <View style={[styles.viewUp, styleUp]}>
            <ImageIcon indexToken={indexToken} />
            <View style={[styles.viewTitle]}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.title}
              >
                {symbol}
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[styles.subTitle]}
              >
                {title}
              </Text>
            </View>
            <View style={styles.viewEther}>
              <FadeText
                text={`${Helper.formatETH(balanceToken)}`}
                isShow={isHideValue}
                textStyle={[
                  styles.numberEther
                ]}
                style={{ right: 0, alignItems: 'flex-end' }}
              />
              <FadeText
                text={`$${Helper.formatUSD(balanceInDollar.toString(10))}`}
                isShow={isHideValue}
                textStyle={[
                  styles.dollaEther
                ]}
                style={{ right: 0, alignItems: 'flex-end' }}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    marginHorizontal: 15,
    flex: 1
  },
  viewUp: {
    flexDirection: 'row',
    height: 50,
    flex: 1,
    alignItems: 'center'
  },
  viewTitle: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center'
  },
  viewEther: {
    marginLeft: 8,
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  title: {
    fontFamily: AppStyle.mainFontSemiBold,
    fontSize: 16,
    color: AppStyle.mainTextColor
  },
  subTitle: {
    marginTop: 3.5,
    fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
    fontSize: 14,
    color: AppStyle.secondaryTextColor
  },
  numberEther: {
    fontSize: 18,
    color: AppStyle.mainColor,
    fontFamily: AppStyle.mainFontSemiBold
  },
  dollaEther: {
    fontSize: 14,
    marginTop: 4,
    color: AppStyle.mainTextColor,
    fontFamily: AppStyle.mainFontSemiBold
  }
})
