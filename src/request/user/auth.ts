import { post } from '@/request/request';
import {
  IUserLoginParams,
  IUserResetPasswordParams,
  IUserSendCodeParams,
  IUserVerifyCodeParams,
} from '@/types';

export const _userLogin = (params: IUserLoginParams) => {
  return post('/usercenter/api/lender/user/sign_in', params);
};

export const _userSendVerifyCode = (params: IUserSendCodeParams) => {
  return post('/usercenter/api/lender/resetPassword/admin/sendCode', params);
};

export const _userVerifyCode = (params: IUserVerifyCodeParams) => {
  return post('/usercenter/api/lender/resetPassword/admin/verifyCode', params);
};

export const _userRestPassword = (params: IUserResetPasswordParams) => {
  return post('/usercenter/api/lender/resetPassword/admin/complete', params);
};
