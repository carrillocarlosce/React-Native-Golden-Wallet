import axios from 'axios'
import qs from 'querystring'

const METHOD_GET = 'get'
const METHOD_POST = 'post'
const METHOD_PUT = 'put'
const METHOD_DELETE = 'delete'

function requestAPI(method, url, _headers = {}, _dataBody, isJSON = false) {
  const headers = _headers
  let dataBody = _dataBody

  if (isJSON) {
    headers['Content-Type'] = 'application/json'
  }

  if (isJSON && (method === METHOD_POST || method === METHOD_PUT)) {
    headers['Content-Type'] = 'application/json'
  } else if (method === METHOD_POST || method === METHOD_PUT) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded'
    dataBody = qs.stringify(dataBody)
  }

  const config = {
    url,
    headers,
    method,
    validateStatus: () => true
  }

  if (method === METHOD_GET) {
    config.params = dataBody
  } else {
    config.data = dataBody
  }

  return axios(config)
}

const ApiCaller = {
  get(url, dataBody, isJSON = false, headers = {}, baseUrl) {
    return requestAPI(METHOD_GET, url, headers, dataBody, isJSON, baseUrl)
  },

  post(url, dataBody, isJSON = false, headers = {}, baseUrl) {
    return requestAPI(METHOD_POST, url, headers, dataBody, isJSON, baseUrl)
  },

  put(url, dataBody, isJSON = false, headers = {}, baseUrl) {
    return requestAPI(METHOD_PUT, url, headers, dataBody, isJSON, baseUrl)
  },

  delete(url, dataBody, isJSON = false, headers = {}, baseUrl) {
    return requestAPI(METHOD_DELETE, url, headers, dataBody, isJSON, baseUrl)
  }
}

export default ApiCaller
