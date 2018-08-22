import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView
} from 'react-native'
import { observer } from 'mobx-react'
import AppStyle from '../../../commons/AppStyle'
import images from '../../../commons/images'
import LayoutUtils from '../../../commons/LayoutUtils'
import constant from '../../../commons/constant'
import NavStore from '../../../AppStores/NavStore'
import MainStore from '../../../AppStores/MainStore'
import ActionSheetCustom from '../../../components/elements/ActionSheetCustom'
import AppState from '../../../AppStores/AppState'
import InputWithAction from '../../../components/elements/InputWithActionItem'

const { height } = Dimensions.get('window')
const extraBottom = LayoutUtils.getExtraBottom()
const isIPX = height === 812
@observer
export default class ConfirmScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      translateX: new Animated.Value(200),
      translateY: new Animated.Value(0),
      opacity: new Animated.Value(0),
      isShowAdvance: false,
      bottom: 0,
      marginVertical: new Animated.Value(20)
      // borderRadius: 5
    }
  }

  componentWillMount() {
    // MainStore.sendTransaction.confirmStore.setGasPrice(MainStore.appState.gasPriceEstimate.standard)
    MainStore.sendTransaction.confirmStore.estimateGas()
    MainStore.sendTransaction.confirmStore.validateAmount()
  }

  onDefaultPress() {
    const { advanceStore } = MainStore.sendTransaction
    const { gasPriceEstimate } = AppState
    advanceStore.reset()
    advanceStore.setGasLimit('21000')
    advanceStore.setGasPrice(gasPriceEstimate.standard.toString())
  }

  onDone() {
    const { advanceStore } = MainStore.sendTransaction
    Animated.parallel([
      Animated.timing(
        this.state.translateX,
        {
          toValue: 200,
          duration: 200,
          useNativeDriver: true
        }
      ),
      Animated.timing(
        this.state.opacity,
        {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        }
      )
    ]).start()
    advanceStore._onDone()
    setTimeout(() => this.setState({ isShowAdvance: false }), 200)
  }

  showAdvance = () => {
    MainStore.sendTransaction.confirmStore._onShowAdvance()
    this.setState({ isShowAdvance: true }, () => {
      Animated.parallel([
        Animated.timing(
          this.state.translateX,
          {
            toValue: 0,
            duration: 200,
            useNativeDriver: true
          }
        ),
        Animated.timing(
          this.state.opacity,
          {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
          }
        )
      ]).start()
    })
  }

  hideAdvance = () => {
    const { advanceStore } = MainStore.sendTransaction
    if (advanceStore.validateGas) {
      this.onDone()
    } else {
      Keyboard.dismiss()
      NavStore.popupCustom.show('Confirm', [
        {
          text: 'No',
          onClick: () => {
            NavStore.popupCustom.hide()
          }
        },
        {
          text: 'Yes',
          onClick: () => {
            this.onDefaultPress()
            NavStore.popupCustom.hide()
            this.onDone()
          }
        }
      ], 'Network fee is invalid. Do you want to reset to Standard Fee?')
    }
  }

  _renderConfirmHeader() {
    return (
      <View
        style={styles.confirmHeader}
      >
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => this._onCancel()}
        >
          <Image source={images.closeButton} style={styles.closeIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Confirmation</Text>
        <TouchableOpacity
          style={styles.advanceBtn}
          onPress={() => this.showAdvance()}
        >
          <Image source={images.advanceIcn} style={styles.closeIcon} />
        </TouchableOpacity>
      </View>
    )
  }

  _renderConfirmContent(ethAmount, usdAmount, from, to, fee) {
    const { confirmStore } = MainStore.sendTransaction
    return (
      <View>
        <View
          style={{
            alignItems: 'center',
            marginTop: 20
          }}
        >
          <Text
            style={styles.amount}
          >
            {ethAmount}
          </Text>
          <Text
            style={styles.usdAmount}
          >
            {usdAmount}
          </Text>
        </View>
        <View>
          <View style={styles.item}>
            <Text style={styles.key}>
              From
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="middle"
              style={styles.value}
            >
              {from}
            </Text>
          </View>
          <View style={styles.line} />
          <View style={styles.item}>
            <Text style={styles.key}>
              To
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="middle"
              style={styles.value}
            >
              {to}
            </Text>
          </View>
          <View style={styles.line} />
          <View style={styles.item}>
            <Text style={styles.key}>
              Fee
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.value, { fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular', fontSize: 14 }]}>
                {fee}
              </Text>
              <TouchableOpacity
                style={styles.standard}
                onPress={() => this.actionSheet.show()}
              >
                <Text style={styles.standardText}>{confirmStore.adjust}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    )
  }

  _renderSendBtn() {
    return (
      <TouchableOpacity
        style={styles.sendBtn}
        onPress={() => {
          this._onSend()
          // sendStore.estimateGas()
        }}
      >
        <Text style={styles.sendText}>{constant.SEND}</Text>
      </TouchableOpacity>
    )
  }

  _renderAdvanceHeader() {
    return (
      <View
        style={styles.confirmHeader}
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => this.hideAdvance()}
        >
          <Image source={images.backButton} style={styles.backIcon} resizeMode="contain" />
          <Text style={[styles.title]}>Advance</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.standard,
            {
              position: 'absolute',
              right: 20,
              marginTop: 0,
              marginLeft: 0
            }
          ]}
          onPress={() => {
            Keyboard.dismiss()
            this.onDefaultPress()
          }}
        >
          <Text style={styles.standardText}>Default</Text>
        </TouchableOpacity>
      </View>
    )
  }

  validateGasPrice(advanceStore, t) {
    if (t <= 0) {
      advanceStore.setGasPriceErr('Gas price must be greater than 0')
    } else if (t > 100) {
      advanceStore.setGasPriceErr('Gas price must be lesser than 100')
    } else {
      advanceStore.setGasPriceErr('')
    }
  }
  validateGasLimit(advanceStore, t) {
    if (t < 21000) {
      advanceStore.setGasLimitErr('Gas limit must be greater than 21000')
    } else if (t > 150000) {
      advanceStore.setGasLimitErr('Gas limit must be lesser than 150000')
    } else {
      advanceStore.setGasLimitErr('')
    }
  }

  _renderAdvanceContent(isShowClearGasLimit, isShowClearGasPrice, gasLimit, gasGwei, tmpFee, gasLimitErr, gasGweiErr, advanceStore) {
    return (
      <View>
        <View
          style={[styles.item, { marginTop: 20, marginBottom: 50 }]}
        >
          <View style={styles.labelHolder}>
            <Text
              style={styles.key}
            >
              Gas Limit
            </Text>
            <Image
              style={styles.iconLabel}
              source={images.iconInfo}
            />
          </View>
          <View>
            {/* <TextInput
              ref={ref => (this.gasLimit = ref)}
              style={styles.textInput}
              keyboardAppearance="dark"
              value={gasLimit}
              keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
              onChangeText={(t) => {
                advanceStore.setGasLimit(t)
                advanceStore.setShowClearGasLimit(t != '')
                console.log(advanceStore)
                this.validateGasLimit(advanceStore, t)
              }}
            />
            {isShowClearGasLimit &&
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={this.clearGasLimit(advanceStore)}
              >
                <Image source={images.iconCloseSearch} style={styles.iconClear} />
              </TouchableOpacity>} */}
            <InputWithAction
              ref={ref => (this.gasLimit = ref)}
              style={styles.textInput}
              // keyboardAppearance="dark"
              value={gasLimit}
              keyboardType="number-pad"
              onChangeText={(t) => {
                advanceStore.setGasLimit(t)
                // advanceStore.setShowClearGasLimit(t != '')
                console.log(advanceStore)
                this.validateGasLimit(advanceStore, t)
              }}
            />
            {gasLimitErr !== '' &&
              <Text
                style={styles.err}
              >
                {gasLimitErr}
              </Text>}
          </View>
          <View style={styles.labelHolder}>
            <Text
              style={styles.key}
            >
              Gas Price (Gwei)
            </Text>
            <Image
              style={styles.iconLabel}
              source={images.iconInfo}
            />
          </View>
          <View>
            {/* <TextInput
              ref={ref => (this.gasGwei = ref)}
              keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
              keyboardAppearance="dark"
              value={gasGwei}
              style={styles.textInput}
              onChangeText={(t) => {
                advanceStore.setGasPrice(t)
                this.validateGasPrice(advanceStore, t)
              }}
            />
            {isShowClearGasPrice &&
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={this.clearGasGwei(advanceStore)}
              >
                <Image source={images.iconCloseSearch} style={styles.iconClear} />
              </TouchableOpacity>} */}
            <InputWithAction
              ref={ref => (this.gasGwei = ref)}
              keyboardType="number-pad"
              // keyboardAppearance="dark"
              value={gasGwei}
              style={styles.textInput}
              onChangeText={(t) => {
                advanceStore.setGasPrice(t)
                this.validateGasPrice(advanceStore, t)
              }}
            />
            {gasGweiErr !== '' &&
              <Text
                style={styles.err}
              >
                {gasGweiErr}
              </Text>}
          </View>
          <View style={styles.labelHolder}>
            <Text
              style={styles.key}
            >
              Network Fee
            </Text>
            <Image
              style={styles.iconLabel}
              source={images.iconInfo}
            />
          </View>
          <TextInput
            editable={false}
            keyboardAppearance="dark"
            ref={ref => (this.fee = ref)}
            value={`${tmpFee}`}
            style={[styles.textInput, {
              color: AppStyle.secondaryTextColor,
              paddingHorizontal: 10,
              fontFamily: 'OpenSans-Semibold',
              fontSize: 14
            }]}
          />
        </View>
      </View>
    )
  }

  clearGasLimit = (advanceStore) => {
    advanceStore.setGasLimit('')
    advanceStore.setGasLimitErr('')
    advanceStore.setDisableDone(false)
  }

  clearGasGwei = (advanceStore) => {
    advanceStore.setGasPrice('')
    advanceStore.setGasPriceErr('')
    advanceStore.setDisableDone(false)
  }

  _onSend(advanceStore) {
    MainStore.sendTransaction.sendTx()
    // NavStore.showLoading()
    // Checker.checkInternet().then((res) => {
    //   if (res === true) {
    //     if (sendStore.selectedToken.title === 'ETH') {
    //       this._actionSendETH()
    //     } else {
    //       this._actionSendToken()
    //     }
    //   } else {
    //     NavStore.hideLoading()
    //     NavStore.popupCustom.show(
    //       'No internet',
    //       [
    //         {
    //           text: 'Ok',
    //           onClick: () => {
    //             NavStore.popupCustom.hide()
    //           }
    //         }
    //       ]
    //     )
    //   }
    // })
  }

  // _actionSendETH() {
  //   sendStore.sendETH()
  //     .then((res) => {
  //       console.log('Done: ', res)
  //       HapticHandler.NotificationSuccess()
  //       NavStore.navigator.dispatch(NavigationActions.back())
  //       NavStore.navigator.dispatch(NavigationActions.back())
  //       NavStore.popupCustom.show('Send success')
  //       setTimeout(() => {
  //         sendStore.clearData()
  //       }, 500)
  //     })
  //     .catch((err) => {
  //       NavStore.popupCustom.show(err.message)
  //     })
  // }

  // _actionSendToken() {
  //   sendStore.sendToken()
  //     .then((res) => {
  //       console.log('Done: ', res)
  //       HapticHandler.NotificationSuccess()
  //       NavStore.navigator.dispatch(NavigationActions.back())
  //       NavStore.navigator.dispatch(NavigationActions.back())
  //       NavStore.popupCustom.show('Send success')
  //       setTimeout(() => {
  //         sendStore.clearData()
  //       }, 500)
  //     })
  //     .catch((err) => {
  //       NavStore.popupCustom.show(err.message)
  //     })
  // }

  _onCancel() {
    NavStore.popupCustom.hide()
    MainStore.sendTransaction.addressInputStore.confirmModal && MainStore.sendTransaction.addressInputStore.confirmModal.close()
  }

  // _renderDoneBtn(advanceStore) {
  //   return (
  //     <TouchableOpacity
  //       disabled={this.state.isDisableDone}
  //       style={[styles.doneBtn, { borderRadius: this.state.borderRadius }]}
  //       onPress={this._onDone}
  //     >
  //       <Text
  //         style={[styles.sendText, { color: advanceStore.isDisableDone ? '#8a8d97' : AppStyle.mainColor }]}
  //       >
  //         {constant.DONE}
  //       </Text>
  //     </TouchableOpacity >
  //   )
  // }

  _renderActionSheet() {
    const { gasPriceEstimate } = MainStore.appState
    return (
      <ActionSheetCustom ref={(ref) => { this.actionSheet = ref }} onCancel={this._onCancelAction}>
        <View style={[styles.actionSheetItem, { borderTopLeftRadius: 5, borderTopRightRadius: 5, height: 60 }]}>
          <Text style={[styles.actionSheetText, { fontSize: 12, color: '#8A8D97' }]}>Your transaction will process faster with a higher</Text>
          <Text style={[styles.actionSheetText, { fontSize: 12, color: '#8A8D97' }]}>gas price.</Text>
        </View>
        <TouchableOpacity
          style={styles.actionSheetItem}
          onPress={() => this._onPressAction(gasPriceEstimate.slow, 'Slow')}
        >
          <Text style={styles.actionSheetText}>{`Slow (<30 minutes) ${gasPriceEstimate.slow} Gwei`}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionSheetItem}
          onPress={() => this._onPressAction(gasPriceEstimate.standard, 'Standard')}
        >
          <Text style={styles.actionSheetText}>{`Standard (<5 minutes) ${gasPriceEstimate.standard} Gwei`}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionSheetItem, { borderBottomLeftRadius: 5, borderBottomRightRadius: 5, borderBottomWidth: 0 }]}
          onPress={() => this._onPressAction(gasPriceEstimate.fast, 'Fast')}
        >
          <Text style={styles.actionSheetText}>{`Fast (<2 minutes) ${gasPriceEstimate.fast} Gwei`}</Text>
        </TouchableOpacity>
      </ActionSheetCustom>
    )
  }

  // _onDone = () => {
  //   const { advanceStore } = MainStore.sendTransaction
  //   const gasLimit = Number(advanceStore.gasLimit)
  //   const gasPrice = Number(advanceStore.gasPrice)
  //   let errCount = 0
  //   if (Number.isNaN(gasLimit) || Number.isNaN(gasPrice)) {
  //     return NavStore.popupCustom.show(
  //       'Invalid number',
  //       [
  //         {
  //           text: 'Ok',
  //           onClick: () => {
  //             NavStore.popupCustom.hide()
  //           }
  //         }
  //       ]
  //     )
  //   }
  //   if (gasLimit < 21000) {
  //     errCount++
  //     advanceStore.setGasLimitErr('Gas limit must be greater than 21000')
  //   }
  //   if (gasPrice <= 0) {
  //     errCount++
  //     advanceStore.setGasPriceErr('Gas price must be greater than 0')
  //   }
  //   if (errCount === 0) {
  //     // sendStore.setGasLimit(gasLimit)
  //     // sendStore.setGasPrice(gasGwei)
  //     // sendStore.validateAmount()
  //     // TODO Done
  //     this.hideAdvance()
  //   } else {
  //     // this.setState({ isDisableDone: true })
  //     advanceStore.setDisableDone(true)
  //   }
  //   advanceStore._onDone()
  //   return true
  // }

  _runKeyboardAnim(toValue) {
    Animated.parallel([
      Animated.timing(
        this.state.marginVertical,
        {
          toValue: toValue === 0 ? 20 : 0,
          duration: 250
        }
      )
    ]).start()
  }

  _runExtraHeight(toValue) {
    Animated.timing(
      // Animate value over time
      this.state.translateY, // The value to drive
      {
        toValue: -toValue, // Animate to final value of 1
        duration: 250
        // useNativeDriver: true
      }
    ).start()
  }

  _keyboardDidShow(e) {
    if (this.gasLimit.isFocused() || this.gasGwei.isFocused()) {
      const value = 500 + e.endCoordinates.height - height
      if (isIPX) {
        // value += 10
      }
      // this.setState({ bottom: value + 20, borderRadius: 0 })
      this.setState({ bottom: value + 20 })
      const extra = extraBottom === 0 ? -10 : -extraBottom
      if (isIPX) {
        // extra = -30
      }
      this._runExtraHeight(value > 0 ? value : extra)
      this._runKeyboardAnim(value - 20)
    }
  }

  _keyboardDidHide(e) {
    this._runKeyboardAnim(0)
    this._runExtraHeight(0)
    // this.setState({ bottom: 0, borderRadius: 5 })
    this.setState({ bottom: 0 })
  }

  _onCancelAction = () => {
    this.actionSheet.hide()
  }

  _onPressAction = (gasPrice, adj) => {
    MainStore.sendTransaction.confirmStore.setGasPrice(gasPrice)
    MainStore.sendTransaction.confirmStore.validateAmount()
    MainStore.sendTransaction.confirmStore.setAdjust(adj)
    this.actionSheet.hide()
  }

  render() {
    const {
      translateX,
      translateY,
      opacity,
      isShowAdvance,
      bottom,
      marginVertical
    } = this.state
    const { advanceStore, confirmStore } = MainStore.sendTransaction
    const {
      isShowClearGasLimit,
      isShowClearGasPrice,
      gasLimit,
      gasPrice,
      gasLimitErr,
      gasGweiErr,
      formatedTmpFee
    } = advanceStore
    const {
      formatedFee,
      formatedAmount,
      formatedDolar
    } = confirmStore
    const to = MainStore.sendTransaction.address
    // const tmpFee = `${(gasLimit * gasGwei) / 1000000000}`
    // const wallet = sendStore.getWallet
    // console.log('wallet', wallet)
    // const {ratio} = sendStore.wallet
    // const tmpFeeUsd = numeral(tmpFee * ratio).format('0,0.[00]')
    // const eth = Helper.formatETH(value)
    // const usdAmount = Helper.formatUSD(value * ratio)
    const { address } = MainStore.appState.selectedWallet
    // const address = '0x0ai00a0a0a0'
    return (
      <TouchableWithoutFeedback onPress={this._onCancelAction}>
        <View
          style={styles.container}
        >
          <Animated.View
            style={[
              styles.confirmContainer,
              {
              }
            ]}
          >
            {this._renderConfirmHeader()}
            {this._renderConfirmContent(formatedAmount, formatedDolar, address, to, formatedFee)}
            {this._renderSendBtn()}
          </Animated.View>
          {isShowAdvance &&
            <View
              style={[styles.advanceContainer]}
            >
              <Animated.View
                style={[
                  { flex: 1, backgroundColor: AppStyle.backgroundColor },
                  {
                    transform: [
                      { translateX }
                    ],
                    opacity
                  }
                ]}
              >
                <ScrollView
                  keyboardShouldPersistTaps="always"
                  style={{ marginBottom: bottom }}
                >
                  <TouchableWithoutFeedback
                    onPress={() => Keyboard.dismiss()}
                  >
                    <View style={{ flex: 1 }}>
                      {this._renderAdvanceHeader()}
                      {this._renderAdvanceContent(isShowClearGasLimit, isShowClearGasPrice, gasLimit, gasPrice, formatedTmpFee, gasLimitErr, gasGweiErr, advanceStore)}
                      {/* {this._renderDoneBtn()} */}
                    </View>
                  </TouchableWithoutFeedback>
                </ScrollView>
              </Animated.View>
              <Animated.View
                style={[
                  {
                    transform: [
                      { translateY }
                    ],
                    paddingLeft: marginVertical,
                    paddingRight: marginVertical,
                    bottom: extraBottom !== 0 ? extraBottom : 20,
                    backgroundColor: AppStyle.backgroundColor
                  }
                ]}
              >
                {/* {this._renderDoneBtn(advanceStore)} */}
              </Animated.View>
            </View>
          }
          {this._renderActionSheet()}
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  confirmContainer: {
    flex: 1
  },
  advanceContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
    // backgroundColor: AppStyle.backgroundColor
  },
  confirmHeader: {
    height: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  closeIcon: {
    width: 20,
    height: 20
  },
  title: {
    color: '#E5E5E5',
    fontSize: 18,
    fontFamily: 'OpenSans-Semibold'
  },
  closeBtn: {
    marginLeft: 20,
    padding: 5
  },
  advanceBtn: {
    marginRight: 20
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20
  },
  backIcon: {
    width: 20,
    height: 20,
    marginRight: 10
  },
  key: {
    fontFamily: 'OpenSans-Semibold',
    fontSize: 16,
    color: AppStyle.mainTextColor
    // marginTop: 15
  },
  value: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'CourierNew',
    fontSize: 16,
    color: AppStyle.secondaryTextColor,
    marginTop: 10,
    marginBottom: 15
  },
  item: {
    paddingLeft: 20,
    paddingRight: 20
  },
  amount: {
    color: '#E4BF43',
    fontSize: 30,
    fontFamily: 'OpenSans-Bold'
  },
  usdAmount: {
    fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
    fontSize: 20,
    color: AppStyle.secondaryTextColor
  },
  sendBtn: {
    position: 'absolute',
    backgroundColor: AppStyle.backgroundDarkBlue,
    borderRadius: 5,
    bottom: 20,
    left: 20,
    right: 20,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendText: {
    color: AppStyle.mainColor,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 18
  },
  textInput: {
    height: 40,
    borderRadius: 5,
    backgroundColor: '#14192d',
    alignSelf: 'stretch',
    marginTop: 10
    // paddingRight: 10
  },
  // doneBtn: {
  //   backgroundColor: AppStyle.backgroundDarkBlue,
  //   height: 50,
  //   alignItems: 'center',
  //   justifyContent: 'center'
  // },
  line: {
    height: 1,
    backgroundColor: '#14192D',
    marginLeft: 20,
    marginRight: 20
  },
  // clearBtn: {
  //   position: 'absolute',
  //   right: 10,
  //   top: 19
  // },
  err: {
    color: 'red',
    marginTop: 10,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 12
  },
  standard: {
    height: 30,
    backgroundColor: AppStyle.backgroundDarkBlue,
    borderRadius: 20,
    justifyContent: 'center',
    paddingLeft: 11,
    paddingRight: 11,
    marginTop: 5,
    marginLeft: 10
  },
  standardText: {
    color: '#4A90E2',
    fontFamily: 'OpenSans-Semibold',
    fontSize: 14
  },
  actionSheetItem: {
    height: 55,
    backgroundColor: AppStyle.backgroundDarkBlue,
    borderBottomWidth: 1,
    borderColor: AppStyle.borderLinesSetting,
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionSheetText: {
    fontSize: 16,
    color: '#4A90E2',
    fontFamily: 'OpenSans-Semibold'
  },
  labelHolder: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15
  },
  iconLabel: {
    marginLeft: 8,
    width: 16,
    height: 16
  }

})
