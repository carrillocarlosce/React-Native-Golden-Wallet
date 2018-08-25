import { ec as Ec } from 'elliptic'
import sha3 from 'js-sha3'

const secp256k1 = new Ec('secp256k1')

export default class EthereumAddress {
  privateKey = null

  constructor(privateKey) {
    if (!privateKey) throw new Error('Private key is required')
    this.privateKey = privateKey.substring(0, 2) !== '0x' ? `0x${privateKey}` : privateKey
  }

  keccak256 = data => `0x${sha3.keccak_256(this.arrayify(data))}`

  arrayify = (_value) => {
    if (Array.isArray(_value)) return new Uint8Array(_value)

    let value = _value.substring(2)
    if (value.length % 2) { value = `0${value}` }

    const result = []
    for (let i = 0; i < value.length; i += 2) {
      result.push(parseInt(value.substr(i, 2), 16))
    }

    return new Uint8Array(result)
  }

  getPublicKeyToAddress = (_value, compressed) => {
    const value = this.arrayify(_value)
    if (value.length !== 33 && value.length !== 32 && value.length !== 65) {
      throw new Error('invalid value')
    }

    let keyPair = null

    if (value.length === 32) {
      keyPair = secp256k1.keyFromPrivate(value)
    }

    if (value.length === 33) {
      keyPair = secp256k1.keyFromPublic(value)
    }

    if (value.length === 65) {
      keyPair = secp256k1.keyFromPublic(value)
    }

    return `0x${keyPair.getPublic(!!compressed, 'hex')}`
    // return this.keccak256(pubKey)
  }

  _getAddress(addr) {
    return this._getChecksumAddress(addr)
  }

  _getChecksumAddress(addr) {
    let address = addr.toLowerCase()

    let hashed = address.substring(2).split('')
    for (let i = 0; i < hashed.length; i++) {
      hashed[i] = hashed[i].charCodeAt(0)
    }
    hashed = this.arrayify(this.keccak256(hashed))

    address = address.substring(2).split('')
    for (let i = 0; i < 40; i += 2) {
      if ((hashed[i >> 1] >> 4) >= 8) {
        address[i] = address[i].toUpperCase()
      }
      if ((hashed[i >> 1] & 0x0f) >= 8) {
        address[i + 1] = address[i + 1].toUpperCase()
      }
    }

    return `0x${address.join('')}`
  }

  get address() {
    const keyArrData = this.arrayify(this.privateKey)
    const keyPair = secp256k1.keyFromPrivate(keyArrData)
    const publicKeyConvert = `0x${keyPair.getPublic(false, 'hex')}`
    const pubKey = `0x${this.getPublicKeyToAddress(publicKeyConvert, false).slice(4)}`
    return this._getChecksumAddress(`0x${this.keccak256(pubKey).substring(26)}`).toLowerCase()
  }
}
