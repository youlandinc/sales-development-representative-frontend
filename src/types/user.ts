export enum BizTypeEnum {
  login = 'LOGIN',
  register = 'REGISTER',
  reset_pass = 'RESET_PASS',
  change_pass = 'CHANGE_PASS',
  change_email = 'CHANGE_EMAIL',
}

export enum LoginTypeEnum {
  ylaccount_login = 'YLACCOUNT_LOGIN',
  google_login = 'GOOGLE_LOGIN',
}

export interface IUserLoginParams {
  appkey: string;
  loginType: LoginTypeEnum;
  emailParam: {
    account: string;
    password: string;
  };
}

export interface IUserSendCodeParams {
  email: string;
  appkey: string;
  bizType: BizTypeEnum;
}

export interface IUserVerifyCodeParams {
  email: string;
  appKey: string;
  code: string;
  bizType: BizTypeEnum;
}

export interface IUserResetPasswordParams {
  newPass: string;
  appkey: string;
  verifyCode?: string;
  email: string;
}
