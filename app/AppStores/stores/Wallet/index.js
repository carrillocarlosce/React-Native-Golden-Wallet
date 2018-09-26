import BtcWallet from './Wallet.btc'
import EthWallet from './Wallet'
import Keystore from '../../../../Libs/react-native-golden-keystore'
import WalletDS from '../../DataSource/WalletDS'
import GetAddress, { chainNames } from '../../../Utils/WalletAddresses'

export const generateNew = async (secureDS, title, index = 0, path = Keystore.CoinType.ETH.path, coin = chainNames.ETH, network = 'mainnet') => {
  if (!secureDS) throw new Error('Secure data source is required')
  const mnemonic = await secureDS.deriveMnemonic()
  const { private_key } = await Keystore.createHDKeyPair(mnemonic, '', path, index)
  const { address } = GetAddress(private_key, coin, network)
  secureDS.savePrivateKey(address, private_key)

  if (coin === chainNames.ETH) {
    return new EthWallet({
      address, balance: '0', index, title, isFetchingBalance: true
    }, secureDS)
  }
  return new BtcWallet({
    address, balance: '0', index, title, isFetchingBalance: true
  }, secureDS)
}

export const importPrivateKey = (privateKey, title, secureDS, coin = chainNames.ETH, network = 'mainnet') => {
  const { address } = GetAddress(privateKey, coin, network)
  secureDS.savePrivateKey(address, privateKey)
  if (coin === chainNames.ETH) {
    return new EthWallet({
      address, balance: '0', index: -1, external: true, didBackup: true, importType: 'Private Key', isFetchingBalance: true, title
    }, secureDS)
  }
  return new BtcWallet({
    address, balance: '0', index: -1, external: true, didBackup: true, importType: 'Private Key', isFetchingBalance: true, title
  }, secureDS)
}

export const importAddress = (address, title, secureDS, coin = chainNames.ETH) => {
  if (coin === chainNames.ETH) {
    return new EthWallet({
      address, balance: '0', index: -1, external: true, didBackup: true, importType: 'Address', isFetchingBalance: true, title, canSendTransaction: false
    }, secureDS)
  }
  return new BtcWallet({
    address, balance: '0', index: -1, external: true, didBackup: true, importType: 'Address', isFetchingBalance: true, title, canSendTransaction: false
  }, secureDS)
}

export const unlockFromMnemonic = async (mnemonic, title, index, secureDS, path = Keystore.CoinType.ETH.path, coin = chainNames.ETH, network = 'mainnet') => {
  const { private_key } = await Keystore.createHDKeyPair(mnemonic, '', path, index)
  const { address } = GetAddress(private_key, coin, network)
  secureDS.savePrivateKey(address, private_key)
  if (coin === chainNames.ETH) {
    return new EthWallet({
      address, balance: '0', index: -1, external: true, didBackup: true, importType: 'Mnemonic', isFetchingBalance: true, title
    }, secureDS)
  }
  return new BtcWallet({
    address, balance: '0', index: -1, external: true, didBackup: true, importType: 'Mnemonic', isFetchingBalance: true, title
  }, secureDS)
}

export const getWalletAtAddress = async (address) => {
  return await WalletDS.getWalletAtAddress(address)
}

export const getWalletsFromMnemonic = async (mnemonic, path = Keystore.CoinType.ETH.path, from = 0, to = 20, coin = chainNames.ETH, network = 'mainnet') => {
  const keys = await Keystore.createHDKeyPairs(mnemonic, '', path, from, to)
  const wallets = keys.map((k) => {
    const { address } = GetAddress(k.private_key, coin, network)
    if (coin === chainNames.ETH) {
      return new EthWallet({
        address, balance: '0', index: -1, external: true, didBackup: true, importType: 'Mnemonic', isFetchingBalance: true, title: ''
      })
    }
    return new BtcWallet({
      address, balance: '0', index: -1, external: true, didBackup: true, importType: 'Mnemonic', isFetchingBalance: true, title: ''
    })
  })

  return wallets
}

export const BTCWallet = BtcWallet
export const ETHWallet = EthWallet
