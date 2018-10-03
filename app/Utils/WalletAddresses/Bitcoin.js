import bitcoin from 'react-native-bitcoinjs-lib'
import bigi from 'bigi'

export default class BitcoinAddress {
  privateKey = null
  network = null

  constructor(privateKey, network) {
    if (!privateKey) throw new Error('Private key is required')
    this.privateKey = privateKey
    this.network = network === 'mainnet' ? bitcoin.networks.bitcoin : bitcoin.networks.testnet
  }

  get address() {
    const keyPair = new bitcoin.ECPair(bigi.fromHex(this.privateKey), undefined, { network: this.network })
    const { address } = bitcoin.payments.p2sh({
      redeem: bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey })
    })
    return address
  }
}
