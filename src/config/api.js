import axios from 'axios'

export const API = axios.create({
    baseURL: 'https://api.kontenbase.com/query/api/v1/d9bda5b2-9c4a-4a0b-ade9-7fec476bb04e'
})

export const setAuthToken = (token) => {
    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete API.defaults.headers.common["Authorization"];
    }
};

