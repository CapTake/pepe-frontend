import axios from 'axios'

const baseURL = import.meta.env.VITE_TZKT_API_URL

const getJson = async (url, params) => {
    const headers = {
     "Accept": "application/json",
    }
    
    let reqOptions = {
      baseURL,
      url,
      params,
      method: "GET",
      headers,
    }
    
    const { data } = await axios.request(reqOptions)

    console.log(data)

    return data
}

const getStorage = async (contract, params) => {
    return await getJson(`/contracts/${contract}/storage`, params || {})
}

export default {
    getStorage
}