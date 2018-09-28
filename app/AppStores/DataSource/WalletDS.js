import { AsyncStorage } from 'react-native'
import { ETHWallet, BTCWallet } from '../stores/Wallet'
import NavStore from '../NavStore'
import SecureDS from './SecureDS'

const dataKey = 'WALLETS_STORAGE'

class WalletDataSource {
  wallets = [] // for caching

  async getWallets() {
    const walletsStr = await AsyncStorage.getItem(dataKey)
    if (!walletsStr) return []

    this.wallets = JSON.parse(walletsStr).map((js) => {
      if (js.type === 'ethereum') return new ETHWallet(js)
      return new BTCWallet(js)
    })
    return this.wallets
  }

  async getWalletAtAddress(address) {
    const wallets = this.wallets || await this.getWallets()
    return wallets.find(w => w.address === address)
  }

  async getIndexAtAddress(address) {
    const wallets = this.wallets || await this.getWallets()
    const wallet = await this.getWalletAtAddress(address)
    return wallets.indexOf(wallet)
  }

  saveWallets(walletsArray) {
    const walelts = walletsArray.map(w => w.toJSON())
    return AsyncStorage.setItem(dataKey, JSON.stringify(walelts))
  }

  async updateWallet(wallet) {
    const wallets = await this.getWallets()

    for (let i = 0; i < wallets.length; i++) {
      if (wallets[i].address === wallet.address) {
        wallets[i] = wallet
        this.saveWallets(wallets)
        break
      }
    }
  }

  async addNewWallet(wallet) {
    const wallets = await this.getWallets()
    const find = wallets.find(w => w.address === wallet.address)
    if (!find) wallets.push(wallet)
    return this.saveWallets(wallets)
  }

  async deleteWallet(address) {
    NavStore.lockScreen({
      onUnlock: async (pincode) => {
        const wallets = await this.getWallets()
        const result = wallets.filter(w => w.address != address)
        new SecureDS(pincode).removePrivateKey(address)
        return this.saveWallets(result)
      }
    }, true)
  }
}

export default new WalletDataSource()
