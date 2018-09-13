import { getAddress } from './address'
import keccak256 from './keccak256'
import Convert from './convert'

const utf8 = require('./utf8')

export default {
  getAddress,
  keccak256,
  ...Convert,
  RLP: require('./rlp'),
  ...utf8
}
