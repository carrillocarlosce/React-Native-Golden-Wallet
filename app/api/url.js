export default {
  EtherScan: {
    apiURL: (network) => {
      return (network === 'mainnet')
        ? `https://api.etherscan.io/api`
        : `https://api-${network}.etherscan.io/api`
    },
    webURL: (network) => {
      return (network === 'mainnet')
        ? `https://etherscan.io`
        : `https://${network}.etherscan.io`
    }
  },
  CryptoCompare: {
    apiURL: () => `https://min-api.cryptocompare.com`
  },
  EthGasStation: {
    apiURL: () => `https://ethgasstation.info`
  },
  Skylab: {
    apiURL: () => `http://wallet.skylab.vn`,
    privacyURL: () => `https://goldenwallet.io/privacy`,
    termsURL: () => `https://goldenwallet.io/terms`
  },
  OpenSea: {
    apiURL: () => `https://opensea-api.herokuapp.com`
  }
}
