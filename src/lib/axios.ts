import axios from 'axios';

export const registryClient = axios.create({
  baseURL: 'https://registry.npmjs.org',
  timeout: 8000
});

registryClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return Promise.resolve({ status: 404, data: null });
    }
    if (import.meta.env.DEV) {
      console.error('[Registry Client Error]', error);
    }
    return Promise.reject(error);
  }
);

export const searchClient = axios.create({
  baseURL: 'https://registry.npmjs.org/-/v1',
  timeout: 8000
});

searchClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (import.meta.env.DEV) {
      console.error('[Search Client Error]', error);
    }
    return Promise.reject(error);
  }
);
