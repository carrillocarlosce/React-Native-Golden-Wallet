import EthereumAddress from './Ethereum'
import BitcoinAddress from './Bitcoin'

export const chainNames = {
  ETH: 'Ethereum',
  BTC: 'Bitcoin'
}

export default (privateKey, chainName = 'Ethereum', network = 'mainnet') => {
  switch (chainName) {
    case chainNames.ETH:
      return new EthereumAddress(privateKey)
    case chainNames.BTC:
      return new BitcoinAddress(privateKey, network)
    default: return new EthereumAddress(privateKey)
  }
}
