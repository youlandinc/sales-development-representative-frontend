import { useEffect, useState } from 'react';

export interface ForgetPassword {
  uppercaseError: boolean;
  lowercaseError: boolean;
  specialError: boolean;
  numberError: boolean;
  lengthError: boolean;
}

interface UseCheckPassword {
  password: string;
}

export const useCheckPassword = ({ password }: UseCheckPassword) => {
  const [passwordError, setPasswordError] = useState<ForgetPassword>({
    uppercaseError: false,
    lowercaseError: false,
    specialError: false,
    numberError: false,
    lengthError: false,
  });

  useEffect(() => {
    const uppercaseError = !!password.match(/[A-Z]/g);
    const lowercaseError = !!password.match(/[a-z]/g);
    const specialError = !!password.match(
      /[*?!&￥$%^#,./@";:><\\[\]}{\-=+_\\|》《。，、？’‘“”~]/g,
    );
    const numberError = !!password.match(/\d/g);
    const lengthError = password.length >= 8;
    setPasswordError({
      uppercaseError,
      lowercaseError,
      specialError,
      numberError,
      lengthError,
    });
  }, [password]);

  return {
    passwordError,
  };
};
