import { Keyboard } from 'react-native'
import { observable, action, computed } from 'mobx'
import BigNumber from 'bignumber.js'
import bitcoin from 'react-native-bitcoinjs-lib'
import bigi from 'bigi'
import { NavigationActions } from 'react-navigation'
import AmountStore from './AmountStore'
import AddressInputStore from './AddressInputStore'
import ConfirmStore from './ConfirmStore'
import ConfirmStoreBTC from './ConfirmStore.btc'
import AdvanceStore from './AdvanceStore'
import MainStore from '../../../AppStores/MainStore'
import NavStore from '../../../AppStores/NavStore'
import SecureDS from '../../../AppStores/DataSource/SecureDS'
import HapticHandler from '../../../Handler/HapticHandler'
import AppStyle from '../../../commons/AppStyle'
import { sendTransaction } from '../../../api/ether-json-rpc'
import Interface from '../../../Utils/Ethererum/Contract/interface'
import api from '../../../api'
import MixpanelHandler from '../../../Handler/MixpanelHandler'

const BN = require('bn.js')

class SendStore {
  @observable isToken = false
  amountStore = null
  addressInputStore = null
  confirmStore = null
  txIDData = []

  @observable transaction = {
    gasLimit: new BN('21000'),
    gasPrice: new BN('1000000000')
  }

  constructor() {
    const { type } = MainStore.appState.selectedWallet
    this.amountStore = new AmountStore()
    this.addressInputStore = new AddressInputStore()
    this.confirmStore = type === 'ethereum' ? new ConfirmStore() : new ConfirmStoreBTC()
    this.advanceStore = new AdvanceStore()
  }

  @computed get address() {
    return this.addressInputStore.address
  }

  getPrivateKey(ds) {
    MainStore.appState.selectedWallet.setSecureDS(ds)
    return MainStore.appState.selectedWallet.derivePrivateKey()
  }

  @computed get rpcURL() {
    return MainStore.appState.config.getRPCURL()
  }

  @computed get chainId() {
    return MainStore.appState.config.chainID
  }

  @computed get fromAddress() {
    return MainStore.appState.selectedWallet.address
  }

  @action changeIsToken(bool) {
    this.isToken = bool
  }

  @action setTxIDData(data) {
    this.txIDData = data
  }

  @action goToConfirm() {
    const { selectedWallet } = MainStore.appState
    Keyboard.dismiss()
    if (selectedWallet.type === 'ethereum') {
      NavStore.pushToScreen('ConfirmScreen')
    } else {
      NavStore.showLoading()
      api.getTxID(MainStore.appState.selectedWallet.address).then((res) => {
        if (res && res.data && res.data.unspent_outputs && res.data.unspent_outputs.length > 0) {
          MainStore.sendTransaction.setTxIDData(res.data.unspent_outputs)
          MainStore.sendTransaction.confirmStore.setFee(this.estimateFeeBTC(res.data.unspent_outputs.length, 2))
          NavStore.hideLoading()
          NavStore.pushToScreen('ConfirmScreen')
        } else {
          NavStore.hideLoading()
        }
      })
    }
  }

  sendTx() {
    if (MainStore.appState.internetConnection === 'offline') {
      NavStore.popupCustom.show('No internet connection')
      return
    }
    NavStore.lockScreen({
      onUnlock: (pincode) => {
        NavStore.showLoading()
        const ds = new SecureDS(pincode)
        if (MainStore.appState.selectedWallet.type === 'bitcoin') {
          return this.sendBTC(ds)
            .then(res => this._onSendSuccess(res))
            .catch(err => this._onSendFail(err))
        }
        const transaction = {
          value: this.confirmStore.value,
          to: this.address,
          gasLimit: `0x${this.confirmStore.gasLimit.toString(16)}`,
          gasPrice: `0x${this.confirmStore.gasPrice.toString(16)}`
        }
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
    NavStore.navigator.dispatch(NavigationActions.back())
    NavStore.showToastTop('Your transaction has been pending', {}, { color: AppStyle.colorUp })
  }

  _onSendFail = (err) => {
    NavStore.hideLoading()
    NavStore.popupCustom.show(err.message)
  }

  estimateFeeBTC(m, n) {
    return 93 * m + 102 * n + 200
  }

  sendBTC(ds) {
    let amount = parseInt(MainStore.sendTransaction.confirmStore.value.times(new BigNumber(1e+8)).toFixed(0))
    const toAddress = MainStore.sendTransaction.addressInputStore.address
    let balance = 0
    for (let s = 0; s < this.txIDData.length; s++) {
      balance += this.txIDData[s].value
    }

    const fee = this.estimateFeeBTC(this.txIDData.length, 2)
    this.event(MixpanelHandler.eventName.ACTION_SEND, amount, fee, 'BTC')

    return new Promise((resolve, reject) => {

      this.getPrivateKey(ds)
        .then((privateKey) => {
          const { address: myAddress } = MainStore.appState.selectedWallet

          const mainnet = bitcoin.networks.bitcoin
          const keyPair = new bitcoin.ECPair(bigi.fromHex(privateKey), undefined, { network: mainnet })

          const p2wpkh = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network: mainnet })
          const p2sh = bitcoin.payments.p2sh({ redeem: p2wpkh, network: mainnet })
          const txb = new bitcoin.TransactionBuilder(mainnet)

          for (let ip = 0; ip < this.txIDData.length; ip++) {
            txb.addInput(this.txIDData[ip].tx_hash_big_endian, this.txIDData[ip].tx_output_n)
          }

          const noNeedBack = amount > balance - fee
          if (noNeedBack) {
            amount = balance - fee
          }

          txb.addOutput(toAddress, amount)
          !noNeedBack && txb.addOutput(myAddress, balance - amount - fee)

          for (let ip = 0; ip < this.txIDData.length; ip++) {
            txb.sign(ip, keyPair, p2sh.redeem.output, null, this.txIDData[ip].value)
          }

          const tx = txb.build()

          return api.pushTxBTC(tx.toHex()).then((res) => {
            if (res.status === 200) {
              resolve(tx.getId())
              this.event(MixpanelHandler.eventName.SEND_SUCCESS, amount, fee, 'BTC')
            } else {
              this.event(MixpanelHandler.eventName.SEND_FAIL, amount, fee, 'BTC')
              reject(res.data)
            }
          })
        }).catch((err) => {
          this.event(MixpanelHandler.eventName.SEND_FAIL, amount, fee, 'BTC')
          reject(err)
        })
    })
  }

  sendETH(transaction, ds) {
    if (!this.confirmStore.validateAmount()) {
      const err = { message: 'Not enough gas to send this transaction' }
      return Promise.reject(err)
    }
    const valueFormat = transaction.value
      ? transaction.value.times(new BigNumber(1e+18)).toString(16)
      : transaction.value

    const transactionSend = { ...transaction, value: `0x${valueFormat}` }
    this.event(MixpanelHandler.eventName.ACTION_SEND, transaction.value, this.confirmStore.fee.toString(), 'ETH')
    return new Promise((resolve, reject) => {
      try {
        this.getPrivateKey(ds).then((privateKey) => {
          sendTransaction(this.rpcURL, transactionSend, this.fromAddress, this.chainId, privateKey)
            .then((tx) => {
              this.addAndUpdateGlobalUnpendTransactionInApp(tx, transaction, this.isToken)
              this.event(MixpanelHandler.eventName.SEND_SUCCESS, transaction.value, this.confirmStore.fee.toString(), 'ETH')
              return resolve(tx)
            })
            .catch((err) => {
              this.event(MixpanelHandler.eventName.SEND_FAIL, transaction.value, this.confirmStore.fee.toString(), 'ETH')
              return reject(err)
            })
        }).catch((err) => {
          this.event(MixpanelHandler.eventName.SEND_FAIL, transaction.value, this.confirmStore.fee.toString(), 'ETH')
          return reject(err)
        })
      } catch (e) {
        this.event(MixpanelHandler.eventName.SEND_FAIL, transaction.value, this.confirmStore.fee.toString(), 'ETH')
        return reject(e)
      }
    })
  }

  event(eventName, amount, fee, token) {
    MainStore.appState.mixpanleHandler.track(eventName)
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
    this.event(MixpanelHandler.eventName.ACTION_SEND, transaction.value, this.confirmStore.fee.toString(), token.symbol)
    return new Promise((resolve, reject) => {
      try {
        this.getPrivateKey(ds).then((privateKey) => {
          const numberOfDecimals = token.decimals
          const numberOfTokens = `0x${value.times(new BigNumber(`1e+${numberOfDecimals}`)).toString(16)}`
          const inf = new Interface(abi)
          const transfer = inf.functions.transfer(to, numberOfTokens)
          const unspentTransaction = {
            data: transfer.data,
            to: token.address,
            gasLimit: transaction.gasLimit,
            gasPrice: transaction.gasPrice
          }

          return sendTransaction(this.rpcURL, unspentTransaction, this.fromAddress, this.chainId, privateKey)
            .then((tx) => {
              this.addAndUpdateGlobalUnpendTransactionInApp(tx, transaction, this.isToken)
              this.event(MixpanelHandler.eventName.SEND_SUCCESS, transaction.value, this.confirmStore.fee.toString(), token.symbol)
              return resolve(tx)
            }).catch((e) => {
              this.event(MixpanelHandler.eventName.SEND_FAIL, transaction.value, this.confirmStore.fee.toString(), token.symbol)
              reject(e)
            })
        })
      } catch (e) {
        this.event(MixpanelHandler.eventName.SEND_FAIL, transaction.value, this.confirmStore.fee.toString(), token.symbol)
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
