import axios from 'axios';

import { REQUEST_TIMEOUT } from '@/constant';
import { HttpError, HttpErrorEnum, HttpVariantEnum } from '@/types';
import { USystemLogout } from '@/utils';

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';
//'Access-Control-Allow-Origin': '*',
axios.defaults.headers['Access-Control-Allow-Origin'] = '*';

const service = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: REQUEST_TIMEOUT,
});

// todo request interceptors & response interceptors

// service.interceptors.request.use((config) => {
//   if (rootStore.session) {
//     config.headers.Authorization = `Bearer ${rootStore.session.idToken.jwtToken}`;
//   }

//   return config;
// });

service.interceptors.request.use(
  (config) => {
    const storage = localStorage?.getItem('PERSIST_DATA');
    const accessToken = storage ? JSON.parse(storage)?.state?.accessToken : '';
    const token =
      accessToken || localStorage?.getItem('USER_LOGIN_INFORMATION');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject({
      message: error.message,
      header: '',
      variant: HttpVariantEnum.error,
    });
  },
);

service.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    const { code } = error;

    let notificationObj: HttpError = {
      message: '',
      header: '',
      variant: HttpVariantEnum.error,
    };

    if (error.response) {
      const { message, header, variant, code } = error.response.data;
      notificationObj = {
        message,
        header,
        variant,
      };
      if (code === HttpErrorEnum.token_expired) {
        USystemLogout();
      }
    }

    if (code === 'ECONNABORTED') {
      notificationObj = {
        message: 'A system error has occurred.',
        header: '',
        variant: HttpVariantEnum.error,
      };
    }

    if (code === 'ERR_NETWORK') {
      notificationObj = {
        message:
          'Unable to connect to the server. Please check your network connection and try again.',
        header: 'Network Error',
        variant: HttpVariantEnum.error,
      };
    }

    return Promise.reject(notificationObj);
  },
);

export const { get, post, put, delete: del } = service;
