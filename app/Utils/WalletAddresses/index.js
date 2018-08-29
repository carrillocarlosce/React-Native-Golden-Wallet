import EthereumAddress from './Ethereum'

export const chainNames = {
  ETH: 'Ethereum'
}

export default (privateKey, chainName = 'Ethereum', network = 'mainnet') => {
  switch (chainName) {
    case chainNames.ETH:
      return new EthereumAddress(privateKey)
    default:
  }
}
