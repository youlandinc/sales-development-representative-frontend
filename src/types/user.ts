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
  appkey: string;
  code: string;
  bizType: BizTypeEnum;
}

export interface IUserResetPasswordParams {
  newPass: string;
  appkey: string;
  verifyCode?: string;
  email: string;
}

export enum UserIntegrationEnum {
  hubspot = 'HUBSPOT',
}

export interface UserIntegrationItem {
  tenantId: string;
  account: string | null;
  thirdParty: UserIntegrationEnum;
  oauthUrl: string;
  connected: boolean;
  websiteUrl: string;
}
