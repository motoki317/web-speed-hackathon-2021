import axios from 'axios';

/**
 * @param {string} url
 * @returns {Promise<ArrayBuffer>}
 */
async function fetchBinary(url) {
  return axios.get(url, {
    responseType: 'arraybuffer'
  }).then((res) => res.data);
}

/**
 * @template T
 * @param {string} url
 * @returns {Promise<T>}
 */
async function fetchJSON(url) {
  return axios.get(url, {
    responseType: 'json'
  }).then((res) => res.data);
}

/**
 * @template T
 * @param {string} url
 * @param {File} file
 * @returns {Promise<T>}
 */
async function sendFile(url, file) {
  return axios.post(url, file, {
    headers: {
      'Content-Type': 'application/octet-stream',
    }
  }).then((res) => res.data);
}

/**
 * @template T
 * @param {string} url
 * @param {object} data
 * @returns {Promise<T>}
 */
async function sendJSON(url, data) {
  return axios.post(url, data, {
    headers: {
      'Content-Type': 'application/json',
    }
  }).then((res) => res.data);
}

export { fetchBinary, fetchJSON, sendFile, sendJSON };
