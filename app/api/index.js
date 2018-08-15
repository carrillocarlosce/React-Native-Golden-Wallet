import * as wallet from './wallet'
import * as infura from './infura'

export default {
  ...wallet,
  infura: { ...infura }
}
