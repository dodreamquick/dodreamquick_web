import axios from 'axios'
// import * as axios_logger from 'axios-logger'

// export const baseURL = 'https://api.dodreamquick.com/'
export const baseURL = 'http://localhost:8080/'

export const get_header = async () => {
    let header = await {}
    const token = await localStorage.getItem('token')
    if (token) {
        header = await {Authorization: `JWT ${token}`}
    }
    return header
}

export const api = axios.create({
    baseURL: baseURL,
    timeout: 15000,
})

// api.interceptors.request.use(axios_logger.requestLogger, axios_logger.errorLogger)
// api.interceptors.response.use(axios_logger.responseLogger, axios_logger.errorLogger)
