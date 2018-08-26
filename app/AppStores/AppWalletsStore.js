import { observable, action } from 'mobx'
import WalletDS from './DataSource/WalletDS'

export default class AppWalletsStore {
  @observable wallets = []

  @action async getWalletFromDS() {
    const wallets = await WalletDS.getWallets()

    const walletMap = wallets.reduce((_rs, w, i) => {
      const rs = _rs
      rs[w.address] = i
      return rs
    }, {})

    this.wallets.forEach((w) => {
      const index = walletMap[w.address]
      wallets[index] = w
    })

    this.wallets = wallets
  }

  @action save() {
    return WalletDS.saveWallets(this.wallets)
  }

  @action addOne(wallet) {
    this.wallets = [...this.wallets, wallet]
    return this.save()
  }

  @action async removeOne(wallet) {
    const address = typeof wallet === 'string' ? wallet : wallet.address
    this.wallets = this.wallets.filter(w => w.address !== address)
    return this.save()
  }

  @action removeAll() {
    this.wallets = []
    return this.save()
  }
}
