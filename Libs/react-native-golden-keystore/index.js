
import { NativeModules } from 'react-native'
import CoinType from './coinTypes'

const { RNGoldenKeystore } = NativeModules
const generateMnemonic = (length = 128) => RNGoldenKeystore.generateMnemonic(length)

export default {
  ...RNGoldenKeystore,
  generateMnemonic,
  CoinType
}
