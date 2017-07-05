import axios from 'axios';

axios.defaults.baseURL = CONFIG_CLIENT.publicPath + 'api';

export function get(path, options = {}) {
  return axios({
    method: 'get',
    url: path,
    ...options,
  }).then(resp => resp.data);
}

export function post(path, options = {}) {
  return axios({
    method: 'post',
    url: path,
    ...options,
  }).then(resp => resp.data);
}
