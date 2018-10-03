import { chainNames } from '../Utils/WalletAddresses'

class Checker {
  static checkAddress(address, coin) {
    if (coin === chainNames.ETH) {
      return this.checkAddressETH(address)
    } else if (coin === chainNames.BTC) {
      return this.checkAddressBTC(address)
    }
    // if (address.length !== validateLength) {
    //   return false
    // }
    // return address.match(regx)
  }
  static checkAddressBTC(address) {
    if (address.length < 25 || address.length > 34) {
      return false
    }
    const regx = /^[0-9A-Za-z]{25,34}$/
    return address.match(regx)
  }

  static checkAddressETH(address) {
    const regx = /^0x[0-9A-Fa-f]{40}$/
    if (address.length != 42) {
      return false
    }
    return address.match(regx)
  }

  static checkWIFBTC(wif) {
    if (wif.length !== 52) {
      return false
    }
    const regx = /^[0-9A-Za-z]{52}$/
    return wif.match(regx)
  }

  static checkAddressQR(address, coin = chainNames.ETH) {
    let regx = ''
    if (coin === chainNames.ETH) {
      regx = /^0x[0-9A-Fa-f]{40}$/
    } else if (coin === chainNames.BTC) {
      regx = /^[0-9A-Za-z]{34}$/
    }
    return address.match(regx)
  }
  static checkAddressQRBTC(address) {
    const regx = /[0-9A-Za-z]{34}/
    return address.match(regx)
  }
  static checkPrivateKey(key) {
    const regx = /^[0-9A-Fa-f]{64}$/
    return key.match(regx)
  }
  static checkWalletIsExist(wallets, address) {
    const isExist = wallets.find((w) => {
      if (w.type === 'ethereum') return w.address.toLowerCase() === address.toLowerCase()
      return w.address === address
    })
    return isExist
  }
  static checkNameIsExist(wallets, name) {
    const isExist = wallets.find((w) => {
      return w.title.toLowerCase() === name.toLowerCase()
    })
    return isExist
  }
  static async checkInternet() {
    let probablyHasInternet = false
    try {
      const googleCall = await fetch('https://google.com')
      probablyHasInternet = googleCall.status === 200
    } catch (e) {
      probablyHasInternet = false
    }
    return probablyHasInternet
  }
}

export default Checker
