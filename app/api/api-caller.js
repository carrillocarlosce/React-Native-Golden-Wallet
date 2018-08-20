import axios from 'axios'

const METHOD_GET = 'get'
const METHOD_POST = 'post'
const METHOD_PUT = 'put'
const METHOD_DELETE = 'delete'

function requestAPI(method, url, headers = {}, dataBody, isJSON = false) {
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
