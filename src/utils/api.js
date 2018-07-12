import axios from 'axios'

let base = 'http://47.95.215.194/api/zjut';

export const postRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export const uploadFileRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    headers: {
      'Content-Type': 'multipart/from-data'
    }
  });
}

export const getItem = (url) => {
  return axios(`${base}${url}`);
}

export const deleteItem = (url) => {
  return axios.delete(`${base}${url}`);
}
