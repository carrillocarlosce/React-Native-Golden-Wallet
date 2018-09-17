import caller from './api-caller'
import URL from './url'

/**
 *
 * @param {String} address
 */
export const fetchToken = (address) => {
  if (!address) return Promise.reject()
  const url = `${URL.Skylab.apiURL()}/balance/${address}`
  return caller.get(url, {}, true)
}

export const fetchCollectibles = (address) => {
  const url = `${URL.OpenSea.apiURL()}/assets`
  const data = {
    limit: 100,
    order_by: 'auction_created_date',
    order_direction: 'desc',
    owner: address
  }
  return caller.get(url, data, true)
}

export const fetchTokenDetail = (address, contract) => {
  const url = `${URL.Skylab.apiURL()}/balance/${address}/${contract}`
  return caller.get(url, {}, true)
}

export const getSentTime = (from, to) => {
  const data = {
    from,
    to
  }
  const url = `${URL.Skylab.apiURL()}/transactions/count`
  return caller.get(url, data, true)
}
