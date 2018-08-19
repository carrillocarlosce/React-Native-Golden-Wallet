import { observable, action, computed } from 'mobx'
import BigNumber from 'bignumber.js'
import { NavigationActions } from 'react-navigation'
import AmountStore from './AmountStore'
import AddressInputStore from './AddressInputStore'
import ConfirmStore from './ConfirmStore'
import AdvanceStore from './AdvanceStore'
import Starypto from '../../../../Libs/react-native-starypto'
import MainStore from '../../../AppStores/MainStore'
import NavStore from '../../../AppStores/NavStore'
import SecureDS from '../../../AppStores/DataSource/SecureDS'
import HapticHandler from '../../../Handler/HapticHandler'

// import NavigationStore from '../../../navigation/NavigationStore'
// import ScreenID from '../../../navigation/ScreenID'

const BN = require('bn.js')

class SendStore {
  @observable isToken = false
  amountStore = null
  addressInputStore = null
  confirmStore = null

  @observable transaction = {
    gasLimit: new BN('21000'),
    gasPrice: new BN('1000000000')
  }

  constructor() {
    this.amountStore = new AmountStore()
    this.addressInputStore = new AddressInputStore()
    this.confirmStore = new ConfirmStore()
    this.advanceStore = new AdvanceStore()
  }

  @computed get address() {
    return this.addressInputStore.address
  }

  getPrivateKey(ds) {
    MainStore.appState.selectedWallet.setSecureDS(ds)
    return MainStore.appState.selectedWallet.derivePrivateKey()
  }

  getWalletSendTransaction(privateKey) {
    const { network } = MainStore.appState.config
    const wallet = Starypto.fromPrivateKey(privateKey, Starypto.coinTypes.ETH, network)
    wallet.initProvider('Infura', 'qMZ7EIind33NY9Azu836')
    return wallet
  }

  @action changeIsToken(bool) {
    this.isToken = bool
  }

  sendTx() {
    const transaction = {
      value: this.confirmStore.value,
      to: this.address,
      gasLimit: `0x${this.confirmStore.gasLimit.toString(16)}`,
      gasPrice: `0x${this.confirmStore.gasPrice.toString(16)}`
    }
    // NavigationStore.showModal(ScreenID.UnlockScreen, {
    //   runUnlock: true,
    //   onUnlock: () => {
    //     setTimeout(() => {
    //       const ds = new SecureDS('9999')
    //       if (!this.isToken) {
    //         this.sendETH(transaction, ds)
    //       } else {
    //         this.sendToken(transaction)
    //       }
    //     }, 50)
    //   }
    // }, true)
    if (MainStore.appState.internetConnection === 'offline') {
      NavStore.popupCustom.show('No internet connection')
      return
    }
    NavStore.lockScreen({
      onUnlock: (pincode) => {
        NavStore.showLoading()
        const ds = new SecureDS(pincode)
        if (!this.isToken) {
          return this.sendETH(transaction, ds)
            .then(res => this._onSendSuccess(res))
            .catch(err => this._onSendFail(err))
        }
        return this.sendToken(transaction, ds)
          .then(res => this._onSendSuccess(res))
          .catch(err => this._onSendFail(err))
      }
    }, true)
  }

  _onSendSuccess = (res) => {
    NavStore.hideLoading()
    HapticHandler.NotificationSuccess()
    NavStore.navigator.dispatch(NavigationActions.back())
    NavStore.navigator.dispatch(NavigationActions.back())
    // MainStore.clearSendStore()
    NavStore.showToastTop('Your transaction has been pending')
  }

  _onSendFail = (err) => {
    NavStore.hideLoading()
    NavStore.popupCustom.show(err.message)
  }

  sendETH(transaction, ds) {
    if (!this.confirmStore.validateAmount()) {
      const err = { message: 'Not enough gas to send this transaction' }
      return Promise.reject(err)
    }
    const valueFormat = transaction.value ? transaction.value.times(new BigNumber(1e+18)).toString(16) : transaction.value
    const transactionSend = { ...transaction, value: `0x${valueFormat}` }
    return new Promise((resolve, reject) => {
      try {
        this.getPrivateKey(ds).then((privateKey) => {
          const wallet = this.getWalletSendTransaction(privateKey)
          wallet.sendTransaction(transactionSend)
            .then((tx) => {
              this.addAndUpdateGlobalUnpendTransactionInApp(tx, transaction, this.isToken)
              return resolve(tx)
            })
            .catch((err) => {
              return reject(err)
            })
        }).catch((err) => {
          return reject(err)
        })
      } catch (e) {
        return reject(e)
      }
    })
  }

  sendToken(transaction, ds) {
    if (!this.confirmStore.validateAmount()) {
      const err = { message: 'Not enough gas to send this transaction' }
      return Promise.reject(err)
    }
    const token = MainStore.appState.selectedToken
    const {
      to,
      value
    } = transaction
    return new Promise((resolve, reject) => {
      try {
        this.getPrivateKey(ds).then((privateKey) => {
          const wallet = this.getWalletSendTransaction(privateKey)
          const numberOfDecimals = token.decimals
          const numberOfTokens = `0x${value.times(new BigNumber(`1e+${numberOfDecimals}`)).toString(16)}`
          const inf = new Starypto.Interface(abi)
          const transfer = inf.functions.transfer(to, numberOfTokens)
          const unspentTransaction = {
            data: transfer.data,
            to: token.address,
            gasLimit: transaction.gasLimit,
            gasPrice: transaction.gasPrice
          }

          return wallet.sendTransaction(unspentTransaction).then((tx) => {
            this.addAndUpdateGlobalUnpendTransactionInApp(tx, transaction, this.isToken)
            return resolve(tx)
          }).catch(e => reject(e))
        })
      } catch (e) {
        return reject(e)
      }
    })
  }

  async addAndUpdateGlobalUnpendTransactionInApp(txHash, transaction, isToken) {
    const { selectedToken, selectedWallet } = MainStore.appState
    const {
      to,
      value,
      gasLimit,
      gasPrice
    } = transaction
    const pendingTransaction = {
      timeStamp: Math.floor(Date.now() / 1000),
      hash: txHash,
      from: selectedWallet.address,
      contractAddress: isToken ? selectedToken.address : '',
      to,
      value: isToken
        ? new BigNumber(value).times(`1.0e+${selectedToken.decimals}`).toString(10)
        : new BigNumber(value).times('1.0e+18').toString(10),
      tokenName: isToken ? selectedToken.title : 'Ethereum',
      tokenSymbol: isToken ? selectedToken.symbol : 'ETH',
      tokenDecimal: isToken ? selectedToken.decimals : 18,
      gas: gasLimit,
      gasPrice
    }

    const unpendTxObj = await selectedToken.addUnspendTransaction(pendingTransaction)
    MainStore.appState.setUnpendTransactions([unpendTxObj, ...MainStore.appState.unpendTransactions])
  }
}

const abi = JSON.parse('[{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "stop", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_value", "type": "uint256" }], "name": "burn", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "stopped", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "start", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_name", "type": "string" }], "name": "setName", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [{ "name": "_addressFounder", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "_from", "type": "address" }, { "indexed": true, "name": "_to", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "_owner", "type": "address" }, { "indexed": true, "name": "_spender", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" }], "name": "Approval", "type": "event" }]')

export default SendStore
