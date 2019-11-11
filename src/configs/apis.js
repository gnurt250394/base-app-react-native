import Axios from 'axios'
import utils from './utils'
import { showLoading, hideLoading } from 'library/Loading/LoadingComponent'
// const BASE_URL = 'http://192.168.0.104:8000/api/'
// export const BASE_URI = 'http://192.168.0.104:8000/'
// export const BASE_SOCKET = 'http://192.168.0.104:3001'
// const BASE_URL = 'http://10.0.40.13:8000/api/'
// export const BASE_URI = 'http://10.0.40.13:8000/'
// export const BASE_SOCKET = 'http://10.0.40.13:3001'
const BASE_URL = 'https://app-hackathon-2019.herokuapp.com/api/'
export const BASE_URI = 'https://app-hackathon-2019.herokuapp.com/'
export const BASE_SOCKET = 'https://app-hackathon-2019.herokuapp.com:3001'

const SERVER_TIMEOUT = 10000
let constants = Axios.create({
  baseURL: BASE_URL,
  timeout: SERVER_TIMEOUT,

})
function logError(error) {
  console.log('error: ', error);
  console.group
    && console.group(
      '%cAPI ERROR',
      'color:white;font-weight:bold;background:red;padding:2px 6px',
    );
  if (error.response) {
    const apiName = error.config.apiName || 'UNKNOWN';

    console.log(apiName, error.response);
    console.groupEnd && console.groupEnd()
  } else if (error.request) {
    const apiName = error.config.headers.X_HEADER_API_LOG || 'UNKNOWN';

    console.log(apiName, error.request);
    console.groupEnd && console.groupEnd()
  } else {

    console.log('API Error', error.message);
    console.groupEnd && console.groupEnd()
  }
}
function logResponse(res) {
  console.group
    && console.group(
      '%cAPI Response',
      'color:white;font-weight:bold;background:green;padding:2px 6px',
    );
  console.log('res: ', res)
  console.groupEnd && console.groupEnd()
}
function fetch(url, params, loading) {
  let headers = {
    'Content-Type': 'application/json'
  }
  if (utils.database.token) {
    headers.Authorization = `Bearer ${utils.database.token}`
  }
  !loading ? showLoading() : null
  return constants
    .get(url, {
      params, headers, onDownloadProgress: (progressEvent) => {
        let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total) / 100;
      }
    })
    .then(res => {
      hideLoading()
      logResponse(res)
      return res.data
    })
    .catch(error => {
      hideLoading()
      logError(error)
      return error
    })
}
function put(url, params, isLoading) {
  let headers = {
    'Content-Type': 'application/json'
  }
  if (utils.database.token) {
    headers.Authorization = `Bearer ${utils.database.token}`
  }
  !isLoading ? showLoading() : null
  return constants
    .put(url, params, {
      headers, onUploadProgress: (progressEvent) => {
        let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total) / 100;
      }
    })
    .then(res => {
      logResponse(res)
      hideLoading()
      return res.data
    })
    .catch(error => {
      hideLoading()
      logError(error)
      return error
    })
}
function post(url, params, isLoading) {
  let headers = {
    'Content-Type': 'application/json'
  }
  if (utils.database.token) {
    headers.Authorization = `Bearer ${utils.database.token}`
  }
  !isLoading ? showLoading() : null

  return constants
    .post(url, params, {
      headers, onUploadProgress: (progressEvent) => {
        let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total) / 100;
      }
    })
    .then(res => {
      hideLoading()
      logResponse(res)
      return res.data
    })
    .catch(error => {
      hideLoading()
      logError(error)
      return error

    })
}
function postForm(url, params) {
  let form = new FormData()
  if (typeof params == 'object') {
    Object.keys(params).map(key => {
      form.append(key, params[key])
    })
  }

  let headers = {
    "Content-Type": "multipart/form-data",
  }
  if (utils.database.token) {
    headers.Authorization = `Bearer ${utils.database.token}`
  }
  showLoading()
  return constants
    .post(url, params, {
      headers,
      onUploadProgress: (progressEvent) => {
        let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total) / 100;
      }
    })
    .then(res => {
      hideLoading()
      logResponse(res)
      return res.data
    })
    .catch(error => {
      hideLoading()
      logError(error)
      return error

    })
}
function removeRequest(url) {
  let headers = {
    'Content-Type': 'application/json'
  }
  if (utils.database.token) {
    headers.Authorization = `Bearer ${utils.database.token}`
  }
  showLoading()
  return constants
    .delete(url, {
      headers,
      onUploadProgress: (progressEvent) => {
        let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total) / 100;
      }
    })
    .then(res => {
      hideLoading()
      logResponse(res)
      return res.data
    })
    .catch(error => {
      hideLoading()
      logError(error)
      return error
    })
}
export default {
  PATH: {
    LOGIN: 'login',
    REGISTER: 'register',
    UPLOAD_IMAGE: 'update_avatar',
    CHATS: 'chats',
    USER: 'user',
    VIDEO_CALL: 'event-video-call',
    LIST_HOSPITAL: 'list-hospital',
    CHECK_PHONE: 'check-phone',
    NOTIFICATION: 'list-notification',
    UPDATE_NOTIFICATION: 'update-notification',
    COUNT_NOTIFICATION: 'count-notification',
    LIST_QUESTION: 'list-questions',
    ADD_FOLLOW: 'add-follows',
    LIST_FOLLOW: 'list-follows',
    QUESTION: 'questions',
    REPORT: 'report',
    ADD_TOKEN_FCM: 'add-token',
    COMMUNES: 'list-communes',
    DISTRICT: 'list-districts',
    CITY: 'list-city',
    LIST_DOCTOR: 'list-doctor',
    CHECK_QUESTION: 'check-questions',
    CONFIRM_ANWSER: 'confirm-anwser',
    CHANGE_PASS:'change_password',
    FORGOT_PASS:'fogot_password',
    DRUG:'list-drug',
    DETAIL_DRUG:'details-drug',
    SICK:'list-sicks',
    PRESCRIPTION:'list-prescription',
    DETAIL_PRESCRIPTION:'details-prescription',
    LIST_NOTE:'list-noteDoctor',
    CHECK_TYPE:'check-type'
  },
  fetch,
  put,
  post,
  removeRequest,
  BASE_URI,
  BASE_URL,
  postForm
}
