import CryptoJS from 'crypto-js';

export const USystemLogout = () => {
  localStorage.removeItem('PERSIST_DATA');
};

export const UEncode = (password: string): string => {
  const encodeWord = CryptoJS.enc.Utf8.parse(password);
  return CryptoJS.enc.Base64.stringify(encodeWord);
};

export const UDecode = (password: string): string => {
  const encodedWord = CryptoJS.enc.Base64.parse(password);
  return CryptoJS.enc.Utf8.stringify(encodedWord);
};
