import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  ScrollView
} from 'react-native'
import PropTypes from 'prop-types'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import SmallCard from '../../../components/elements/SmallCard'
import LayoutUtils from '../../../commons/LayoutUtils'
import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'
import { chainNames } from '../../../Utils/WalletAddresses'

const marginTop = LayoutUtils.getExtraTop()
const contentPrivateKey = 'Scan or enter your Private Key to restore your wallet. Make sure to keep your Private Key safe after you are done.'
const contentMnemonicPhrase = 'Enter your Mnemonic Phrase to recover your wallet. Make sure to keep your Mnemonic Phrase safe after you are done.'
const contentAddressOnly = 'Scan or enter your wallet address to monitor it. This is a view only wallet and transaction cannot be sent without a Private Key.'

export default class ImportWalletScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }

  get title() {
    const { navigation } = this.props
    const { coin } = navigation.state.params
    return coin
  }

  get logo() {
    const { navigation } = this.props
    const { coin } = navigation.state.params
    if (coin === chainNames.ETH) return images.logoETH
    return images.logoBTC
  }

  gotoImportAddress = () => {
    const { navigation } = this.props
    const { coin } = navigation.state.params
    navigation.navigate('ImportViaAddressScreen', { coin })
  }

  gotoImportPrivateKey = () => {
    const { navigation } = this.props
    const { coin } = navigation.state.params
    navigation.navigate('ImportViaPrivateKeyScreen', { coin })
  }

  gotoImportMnemonic = () => {
    const { navigation } = this.props
    const { coin } = navigation.state.params
    navigation.navigate('ImportViaMnemonicScreen', { coin })
  }

  goBack = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  render() {
    const { title, logo } = this
    return (
      <View style={styles.container}>
        <NavigationHeader
          style={{ marginTop: marginTop + 20 }}
          headerItem={{
            title,
            icon: logo,
            button: images.backButton
          }}
          action={this.goBack}
        />
        <ScrollView>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <SmallCard
              style={{ height: 174, marginTop: 20 }}
              title="Private Key"
              subtitle={contentPrivateKey}
              imageCard={images.iconPrivateKey}
              onPress={this.gotoImportPrivateKey}
              imageBackground="backgroundCard"
              imageBackgroundStyle={{ height: 174 }}
              titleTextStyle={{ color: AppStyle.mainColor }}
              subtitleTextStyle={{
                color: AppStyle.secondaryTextColor, marginTop: 10
              }}
            />

            <SmallCard
              style={{ height: 174, marginTop: 20 }}
              title="Mnemonic Phrase"
              subtitle={contentMnemonicPhrase}
              imageCard={images.iconMnemonic}
              onPress={this.gotoImportMnemonic}
              titleTextStyle={{ color: AppStyle.mainTextColor }}
              subtitleTextStyle={{
                color: AppStyle.secondaryTextColor, marginTop: 10
              }}
            />

            <SmallCard
              style={{ marginTop: 20, marginBottom: 20, height: 174 }}
              title="Address Only"
              subtitle={contentAddressOnly}
              imageCard={images.iconAddress}
              onPress={this.gotoImportAddress}
              titleTextStyle={{ color: AppStyle.mainTextColor }}
              subtitleTextStyle={{
                color: AppStyle.secondaryTextColor, marginTop: 10
              }}
            />
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
