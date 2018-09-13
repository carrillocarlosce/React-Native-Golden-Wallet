import React, { Component } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { observer } from 'mobx-react/native'
import PropTypes from 'prop-types'
import { NavigationActions } from 'react-navigation'
import AppStyle from '../../../commons/AppStyle'
import images from '../../../commons/images'
import Modal from '../../../../Libs/react-native-modalbox'
import constant from '../../../commons/constant'
import AnimationInput from '../elements/AnimationInput'
import SelectedCoinScreen from './SelectedCoinScreen'
import MainStore from '../../../AppStores/MainStore'
import Config from '../../../AppStores/stores/Config'
import NavStore from '../../../AppStores/NavStore'
import KeyBoard from '../elements/Keyboard'

const { height } = Dimensions.get('window')
const marginTop = Platform.OS === 'ios' ? getStatusBarHeight() : 20
const isIPX = height === 812

@observer
export default class SendTransactionScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }

  constructor(props) {
    super(props)
    this.amountStore = MainStore.sendTransaction.amountStore
    const currentNetwork = MainStore.appState.config.network
    if (currentNetwork !== Config.networks.mainnet) {
      const network = currentNetwork.replace(/^\w/, c => c.toUpperCase())
      NavStore.showToastTop(`You're on the ${network} Testnet.`, {}, { color: AppStyle.mainColor })
    }
  }

  _onCancelTrasaction = () => {
    this.props.navigation.dispatch(NavigationActions.back())
  }

  _onSendPress = () => {
    this.props.navigation.navigate('AddressInputScreen')
    this.amountStore.send()
  }

  _onOpenModal = () => {
    this.amountStore.selectedCoinModal && this.amountStore.selectedCoinModal.open()
  }

  _onCloseModal = () => {
    this.amountStore.selectedCoinModal && this.amountStore.selectedCoinModal.close()
  }

  renderSelectedCoinModal = () => {
    return (
      <Modal
        style={styles.modalStyle}
        swipeToClose
        onClosed={this._onCloseModal}
        position="bottom"
        ref={(ref) => { this.amountStore.setSelectedCoinModal(ref) }}
      >
        <View style={styles.backgroundStyle}>
          <View
            style={styles.viewSelectedCoinScreenStyle}
          />
          <SelectedCoinScreen />
        </View>
      </Modal>
    )
  }

  renderHeader = () => {
    return (
      <View
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.exit}
          onPress={this._onCancelTrasaction}
        >
          <Image style={styles.exitBtn} source={images.closeButton} resizeMode="contain" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerTitle}
          onPress={this._onOpenModal}
        >
          <Text style={styles.walletName}>{this.amountStore.walletName}:</Text>
          <Text style={styles.headerBalance}>{this.amountStore.amountHeaderString}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderInput = (data, subData, postfix) => {
    return (
      <View>
        <AnimationInput
          ref={ref => (this.input = ref)}
          data={data}
          postfix={postfix}
          subData={subData}
        />
      </View>
    )
  }

  renderSendBtn() {
    return (
      <TouchableOpacity
        style={styles.sendTo}
        disabled={!this.amountStore.checkButtonEnable}
        onPress={this._onSendPress}
      >
        <Text style={[styles.sendText, { color: this.amountStore.checkButtonEnable ? AppStyle.mainColor : AppStyle.greyTextInput }]}>
          {constant.SEND_TO}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <View style={styles.viewContainer}>
          {this.renderHeader()}
          {this.renderInput(this.amountStore.getAmountText, this.amountStore.amountSubTextString, this.amountStore.postfix)}
          <View>
            <KeyBoard />
            {this.renderSendBtn()}
          </View>
        </View>
        {this.renderSelectedCoinModal()}
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppStyle.backgroundColor
  },
  viewContainer: {
    flex: 1,
    paddingTop: marginTop,
    justifyContent: 'space-between'
  },
  header: {
    marginTop: 10,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0E1428',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15
  },
  walletName: {
    color: AppStyle.mainTextColor,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'normal'
  },
  headerBalance: {
    fontFamily: AppStyle.mainFontBold,
    fontSize: 18,
    color: AppStyle.mainColor,
    marginLeft: 4
  },
  exit: {
    position: 'absolute',
    left: 22,
    top: 0,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  exitBtn: {
    width: 20,
    height: 20
  },
  sendTo: {
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 5,
    backgroundColor: AppStyle.backgroundDarkBlue
  },
  sendText: {
    fontSize: 18,
    fontFamily: 'OpenSans-Semibold'
  },
  modalStyle: {
    height: isIPX ? height - 150 : height - 80,
    zIndex: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
    backgroundColor: AppStyle.backgroundColor
  },
  viewSelectedCoinScreenStyle: {
    alignSelf: 'center',
    height: 3,
    width: 45,
    borderRadius: 1.5,
    backgroundColor: AppStyle.secondaryTextColor,
    position: 'absolute',
    zIndex: 130,
    top: 10
  },
  backgroundStyle: {
    flex: 1,
    zIndex: 120,
    backgroundColor: AppStyle.backgroundColor
  }
})
