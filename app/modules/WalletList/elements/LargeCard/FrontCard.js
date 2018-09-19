import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform
} from 'react-native'
import { observer } from 'mobx-react/native'
import PropTypes from 'prop-types'
import SyncBalance from '../SyncBalance'
import AppStyle from '../../../../commons/AppStyle'
import MainStore from '../../../../AppStores/MainStore'
import images from '../../../../commons/images'
import Helper from '../../../../commons/Helper'
import constant from '../../../../commons/constant'
import LayoutUtils from '../../../../commons/LayoutUtils'

const { width, height } = Dimensions.get('window')
const isSmallScreen = height < 569
const marginTop = LayoutUtils.getExtraTop()
const cardWidth = width - 72 - 10
const cardHeight = height - 200 - marginTop - 5

@observer
export default class FrontCard extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    onPress: PropTypes.func,
    style: PropTypes.object,
    onAddPrivateKey: PropTypes.func,
    onBackup: PropTypes.func,
    onAlertBackup: PropTypes.func,
    onCopy: PropTypes.func,
    onLongPress: PropTypes.func
  }

  static defaultProps = {
    onPress: () => { },
    style: {},
    onAddPrivateKey: () => { },
    onBackup: () => { },
    onAlertBackup: () => { },
    onCopy: () => { },
    onLongPress: () => { }
  }

  get wallet() {
    const { index } = this.props
    const { length } = MainStore.appState.wallets
    return index < length ? MainStore.appState.wallets[index] : null
  }

  _getStyleOfView(type) {
    switch (type) {
      case 'Address':
        return styles.addressButtonStyle
      default: // Mnemonic + PrivateKey
        return styles.mnemonicButtonStyle
    }
  }

  _getStyleOfText(type) {
    switch (type) {
      case 'Address':
        return styles.addressTextStyle
      default: // Mnemonic + PrivateKey
        return styles.mnemonicTextStyle
    }
  }

  render() {
    const {
      onPress, onLongPress, style, onAddPrivateKey, onBackup, onAlertBackup, onCopy
    } = this.props
    const {
      title, importType, totalBalanceETH, totalBalanceDollar, isFetchingBalance, isHideValue, type
    } = this.wallet

    const isHide = isHideValue
    const backgroundCard = AppStyle.mode1
    const actionButton = (
      <TouchableOpacity
        onPress={() => {
          if (MainStore.appState.didBackup || importType) {
            onCopy()
          } else {
            onAlertBackup()
          }
        }}
      >
        <Image
          source={images.iconQrCode}
        />
      </TouchableOpacity>
    )

    const balanceSecret = !isHide ? `${Helper.formatETH(totalBalanceETH.toString(10))} ETH` : constant.SECRET_WORK
    const balanceUSDSecret = !isHide
      ? `$${Helper.formatUSD(totalBalanceDollar.toString(10))}`
      : constant.SECRET_WORK
    return (
      <TouchableWithoutFeedback
        style={[styles.container, { backgroundColor: backgroundCard }, style]}
        onPress={onPress}
        onLongPress={onLongPress}
      >
        <View style={[styles.container, { backgroundColor: backgroundCard }, style]}>
          <View style={styles.cardHeader}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.cardName}
            >
              {title}
            </Text>
            {!importType && !MainStore.appState.didBackup &&
              <TouchableOpacity
                onPress={onBackup}
              >
                <View style={styles.backupField}>
                  <Text style={styles.backupText}>
                    {constant.BACKUP}
                  </Text>
                </View>
              </TouchableOpacity>
            }
            {importType &&
              <TouchableWithoutFeedback
                onPress={() => {
                  (importType === 'Address') && onAddPrivateKey()
                }}
              >
                <View style={this._getStyleOfView(importType)}>
                  <Text style={this._getStyleOfText(importType)}>
                    {importType === 'Address' ? 'Address Only' : importType}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            }
          </View>
          <Image
            style={
              {
                marginTop: cardHeight * 0.07,
                width: type === 'ethereum' ? cardHeight * 0.31 * 0.63 : cardHeight * 0.42 * 0.63,
                height: type === 'ethereum' ? cardHeight * 0.31 : cardHeight * 0.35
              }
            }
            source={type === 'ethereum' ? images.imgCardETH : images.imgCardBTC}
          />
          <Text style={[styles.balance]}>{balanceSecret}</Text>
          <Text style={[styles.balanceUSD, { marginBottom: 6 }]}>{balanceUSDSecret}</Text>
          {isFetchingBalance && <SyncBalance />}
          <View style={{ position: 'absolute', bottom: isSmallScreen ? 10 : 20 }}>
            {actionButton}
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    height: cardHeight,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10
  },
  cardHeader: {
    width: cardWidth,
    marginTop: 0.06 * cardHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 25,
    paddingRight: 20,
    justifyContent: 'space-between'
  },
  cardName: {
    fontSize: isSmallScreen ? 14 : 20,
    fontFamily: 'OpenSans-Semibold',
    color: AppStyle.mainTextColor,
    maxWidth: cardWidth - 145
  },
  backupField: {
    backgroundColor: '#D0021B',
    paddingHorizontal: isSmallScreen ? 14 : 20,
    height: isSmallScreen ? 20 : 30,
    borderRadius: isSmallScreen ? 10 : 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  backupText: {
    fontSize: isSmallScreen ? 10 : 14,
    fontFamily: 'OpenSans-Semibold',
    color: 'white'
  },
  balance: {
    fontSize: isSmallScreen ? 20 : 30,
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center',
    marginTop: isSmallScreen ? cardHeight * 0.02 : 20,
    color: AppStyle.mainColor
  },
  balanceUSD: {
    fontSize: isSmallScreen ? 15 : 24,
    fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: isSmallScreen ? cardHeight * 0.01 : 10,
    color: AppStyle.secondaryTextColor
  },
  addressButtonStyle: {
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: '#0A0F24'
  },
  mnemonicButtonStyle: {
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderColor: '#22273A',
    backgroundColor: 'transparent',
    borderWidth: 1
  },
  addressTextStyle: {
    fontSize: 12,
    color: AppStyle.mainColor,
    fontFamily: AppStyle.mainFontSemiBold
  },
  mnemonicTextStyle: {
    fontSize: 12,
    color: AppStyle.secondaryTextColor,
    fontFamily: AppStyle.mainFontSemiBold
  }
})
