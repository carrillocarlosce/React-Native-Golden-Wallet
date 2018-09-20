import { AppRegistry } from 'react-native'
import './shim'
import App from './App'
// import bitcoin from 'react-native-bitcoinjs-lib'
// import bigi from 'bigi'
// import Keystore from './Libs/react-native-golden-keystore'

// const mnemonic = 'leaf ridge absent obey region flee list push double pepper demise august jeans someone disagree segment denial dumb'
// const path = "m/49'/0'/0'/0/index"
// Keystore.createHDKeyPair(mnemonic, '', path, 2).then((key) => {
//   const { private_key } = key
//   console.log(key)
//   const keyPair = new bitcoin.ECPair(bigi.fromHex(private_key), undefined, { network: bitcoin.networks.bitcoin })
//   console.log(keyPair.publicKey.toString('hex'))
//   const { address } = bitcoin.payments.p2sh({
//     redeem: bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey })
//   })
//   console.log(address)
//   const txb = new bitcoin.TransactionBuilder()

//   txb.setVersion(1)
//   txb.addInput('2687628b3b4c55d9ad1d7a79769c141dcf8a050f566b7b6867944ab52e49c19d', 0) // Alice's previous transaction output, has 15000 satoshis
//   txb.addOutput('3JmftSgFExY4an5tZLMyARSRnjwGq5LWTS', 2500)
//   txb.addOutput('3Jd4CY5mi33VM9vDB1qJEJ7QJ8NGhpUuf3', 2150)
//   txb.sign(0, keyPair)
//   console.log(txb.build().toHex())
// })

AppRegistry.registerComponent('golden', () => App)
