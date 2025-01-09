export enum HttpErrorEnum {
  token_expired = '40001',
}

export enum HttpVariantEnum {
  error = 'error',
  success = 'success',
  warning = 'warning',
  info = 'info',
}

export interface HttpError {
  message: string;
  header: string;
  variant: HttpVariantEnum;
}
