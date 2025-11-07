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

export interface IUserSignUpParams {
  appKey: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IUserVerifyCodeParams {
  userInfo: string;
  verifyCode: string;
}

export interface IUserResetPasswordParams {
  email: string;
}

export interface IUserSetPasswordParams {
  email: string;
  signature: string;
  newPassword: string;
}

export enum UserIntegrationEnum {
  hubspot = 'HUBSPOT',
  salesforce = 'SALESFORCE',
  pipedrive = 'PIPEDRIVE',
}

export interface UserIntegrationItem {
  tenantId: string;
  account: string | null;
  provider: UserIntegrationEnum;
  oauthUrl: string;
  connected: boolean;
  websiteUrl: string;
}
