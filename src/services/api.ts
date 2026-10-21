import axios from 'axios';
import {dropToken, getToken} from './token';
export const createAPI = () => {
  const api = axios.create({baseURL: 'https://14.design.htmlacademy.pro/six-cities', timeout: 5000});
  api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers['X-Token'] = token;
    }
    return config;
  });
  api.interceptors.response.use((response) => response, (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      dropToken();
    }
    return Promise.reject(error);
  });
  return api;
};
