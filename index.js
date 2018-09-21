import { AppRegistry } from 'react-native'
import './shim'
import App from './App'
// import KeyStore from './Libs/react-native-golden-keystore'
// import bitcoin from 'react-native-bitcoinjs-lib'
// import bigi from 'bigi'

// const mnemonic = 'leaf ridge absent obey region flee list push double pepper demise august jeans someone disagree segment denial dumb'
// const path = `m/49'/0'/0'/0/index`
// const mainnet = bitcoin.networks.bitcoin
// KeyStore.createHDKeyPair(mnemonic, '', path, 2).then((key) => {
//   const { private_key } = key
//   const keyPair = new bitcoin.ECPair(bigi.fromHex(private_key), undefined, { network: mainnet })
//   const { address } = bitcoin.payments.p2sh({
//     redeem: bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey })
//   })
//   const p2wpkh = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network: mainnet })
//   const p2sh = bitcoin.payments.p2sh({ redeem: p2wpkh, network: mainnet })
//   const txb = new bitcoin.TransactionBuilder(mainnet)
//   txb.addInput('44163f21a121ea7894ac622b00a2e7a02f670a298a4a3a7882258e5c2e5c6bc1', 1)
//   txb.addOutput('3JmftSgFExY4an5tZLMyARSRnjwGq5LWTS', 600)
//   txb.sign(0, keyPair, p2sh.redeem.output, null, 911)
//   console.log(txb.build().toHex())
//   console.log(txb.build().getId())
// })

AppRegistry.registerComponent('golden', () => App)
