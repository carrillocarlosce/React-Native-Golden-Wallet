import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Platform,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native'
import PropTypes from 'prop-types'
import QRCode from 'react-native-qrcode'
import ViewShot from 'react-native-view-shot'
import constant from '../../../../commons/constant'
import images from '../../../../commons/images'
import LayoutUtils from '../../../../commons/LayoutUtils'
import commonStyle from '../../../../commons/commonStyles'
import MainStore from '../../../../AppStores/MainStore'
import AppStyle from '../../../../commons/AppStyle'

const { width, height } = Dimensions.get('window')
const isSmallScreen = height < 569
const marginTop = LayoutUtils.getExtraTop()
const cardWidth = width - 72 - 10
const cardHeight = height - 200 - marginTop - 5

export default class BackCard extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    style: PropTypes.object,
    onPress: PropTypes.func,
    onShare: PropTypes.func,
    onLongPress: PropTypes.func
  }

  static defaultProps = {
    style: {},
    onPress: () => { },
    onShare: () => { },
    onLongPress: () => { }
  }

  onShare = () => {
    const { onShare } = this.props
    this.viewShot.capture().then((uri) => {
      const filePath = Platform.OS === 'ios' ? uri : uri.replace('file://', '')
      onShare(filePath)
    })
  }

  get wallet() {
    const { index } = this.props
    const { length } = MainStore.appState.wallets
    return index < length ? MainStore.appState.wallets[index] : null
  }

  render() {
    const { style, onPress, onLongPress } = this.props
    const { address, title } = this.wallet
    const top = address.slice(0, 4)
    const mid = address.slice(4, address.length - 5)
    const bot = address.slice(address.length - 4, address.length)
    const shareText = Platform.OS === 'ios'
      ? (
        <View style={styles.backgroundCopy}>
          <Text style={styles.copyButton}>
            {constant.SHARE}
          </Text>
        </View>
      )
      : (
        <Text
          style={[
            styles.copyButton, styles.backgroundCopy
          ]}
        >
          {constant.SHARE}
        </Text>
      )
    return (
      <TouchableWithoutFeedback
        onPress={onPress}
        onLongPress={onLongPress}
      >
        <View style={[styles.container, { backgroundColor: 'white', justifyContent: 'center' }, style]}>
          <Image
            style={styles.bgImage}
            source={images.backgroundGrey}
          />
          {/* <View style={{ marginTop: cardHeight * 0.12 }}> */}
          <ViewShot style={styles.borderQRCode} ref={(ref) => { this.viewShot = ref }}>
            <QRCode
              style={{ marginTop: 10, marginLeft: 10 }}
              value={address}
              size={isSmallScreen ? 125 : 200}
              bgColor="black"
              fgColor="white"
            />
          </ViewShot>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.cardBackName}
          >
            {title}
          </Text>
          <Text style={[styles.cardBackAddress, commonStyle.fontAddress]}>
            {top}
            <Text style={{ color: AppStyle.secondaryTextColor }}>{mid}</Text>
            {bot}
          </Text>
          <TouchableOpacity
            onPress={this.onShare}
            style={{ marginTop: cardHeight * 0.06 }}
          >
            {shareText}
          </TouchableOpacity>
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
  cardBackName: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
    color: '#4A4A4A',
    marginTop: cardHeight * 0.04,
    maxWidth: cardWidth - 36
  },
  cardBackAddress: {
    fontSize: 14,
    color: AppStyle.greyTextInput,
    marginTop: cardHeight * 0.02,
    paddingHorizontal: 18,
    textAlign: 'center'
  },
  copyButton: {
    fontFamily: 'OpenSans-Bold',
    fontSize: isSmallScreen ? 10 : 14,
    color: AppStyle.backgroundColor
  },
  backgroundCopy: {
    backgroundColor: '#E5E5E5',
    paddingHorizontal: isSmallScreen ? 15 : 26,
    paddingVertical: isSmallScreen ? 4 : 7,
    borderRadius: 16
  },
  borderQRCode: {
    width: 200,
    height: 200,
    backgroundColor: 'white'
  },
  bgImage: {
    position: 'absolute',
    top: 0,
    borderRadius: 14,
    width: width - 82,
    height: cardHeight
  }
})
