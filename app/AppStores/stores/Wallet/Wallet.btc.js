import { observable, action, computed } from 'mobx'
import Wallet from './Wallet'
import Keystore from '../../../../Libs/react-native-golden-keystore'

export default class WalletBTC extends Wallet {
  path = Keystore.CoinType.BTC.path
  type = 'bitcoin'
}
