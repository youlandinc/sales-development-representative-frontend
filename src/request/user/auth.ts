import axios from 'axios';

import { get, post, put } from '@/request/request';
import {
  IUserLoginParams,
  IUserResetPasswordParams,
  IUserSetPasswordParams,
  IUserSignUpParams,
  IUserVerifyCodeParams,
} from '@/types';

export const _userLogin = (params: IUserLoginParams) => {
  return post('/usercenter/api/lender/user/sign_in', params);
};

export const _userSignUp = (params: IUserSignUpParams) => {
  return post('/usercenter/api/sdr/sign_up/init', params);
};

export const _userResetPassword = (params: IUserResetPasswordParams) => {
  return post('/usercenter/api/sdr/reset_password', params);
};

export const _userSetPassword = (params: IUserSetPasswordParams) => {
  return post('/usercenter/api/sdr/set_password', params);
};

export const _userVerifyCode = (params: IUserVerifyCodeParams) => {
  return post('/usercenter/api/sdr/sign_up/verify_code', params);
};

export const _commonUpload = (files: FormData) => {
  return put('/usercenter/api/common/file/upload', files, {
    headers: { 'content-type': 'multipart/form-data' },
  });
};

export const _userGoogleLogin = () => {
  return get('/usercenter/api/sdr/auth/google');
};

export const _fetchUserInfoWithToken = (token: string) => {
  return axios({
    method: 'get',
    headers: { Authorization: `Bearer ${token}` },
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/usercenter/api/user/fetchUserInfo`,
  });
};
