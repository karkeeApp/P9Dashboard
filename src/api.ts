import axios, { AxiosError } from 'axios';
import { notification } from 'antd';
import update from 'immutability-helper';

// Types
import { ErrorResponseData } from '@/types/api';

// Configs
import { API_BASE_URL } from '@/configs/app';

// Redux
import { AUTH_TOKEN } from '@/redux/constants/auth';

const api = axios.create({
  baseURL: `${API_BASE_URL as string}/admin`,
  timeout: 60000,
});

// Config
const TOKEN_PAYLOAD_KEY = 'Authorization';

// API Request Interceptor
api.interceptors.request.use(
  (config) => {
    config.headers = (config.headers || {}) as Record<string, string | number>;

    const jwtToken = localStorage.getItem(AUTH_TOKEN);
    if (jwtToken) {
      config.headers = update<Record<string, string | number>>(config.headers, {
        [TOKEN_PAYLOAD_KEY]: {
          $set: `Bearer ${jwtToken}`,
        },
      });
    }

    return config;
  },
  (error) => {
    // Do something with request error here
    notification.error({
      message: 'Unknown error has occurred',
    });

    return Promise.reject(error);
  },
);

// API Respone Interceptor
api.interceptors.response.use(
  (response) => response,
  (err: AxiosError<ErrorResponseData>) => {
    if (err.response) {
      // Remove token and redirect
      if (err.response.status === 401 || err.response.status === 403) {
        notification.error({
          message: err.response.data.message,
        });
        localStorage.removeItem(AUTH_TOKEN);
        window.location.reload();
      } else {
        notification.error({
          message: err.response.data.message,
        });
      }
    } else {
      notification.error({
        message: 'Unknown error has occurred!',
      });
    }

    return Promise.reject(err);
  },
);

export default api;
