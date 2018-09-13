class Checker {
  static checkAddress(address) {
    if (address.length !== 42) {
      return false
    }
    const regx = /^0x[0-9A-Fa-f]{40}$/
    return address.match(regx)
  }
  static checkAddressQR(address) {
    const regx = /0x[0-9A-Fa-f]{40}/
    return address.match(regx)
  }
  static checkPrivateKey(key) {
    const regx = /^[0-9A-Fa-f]{64}$/
    return key.match(regx)
  }
  static checkWalletIsExist(wallets, address) {
    const isExist = wallets.find((w) => {
      return w.address.toLowerCase() === address.toLowerCase()
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
