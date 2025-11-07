import { Box, Fade, Typography } from '@mui/material';

import { ForgetPassword } from './hooks';

const ERROR_MESSAGE: { label: string; key: keyof ForgetPassword }[] = [
  { label: 'One uppercase character', key: 'uppercaseError' },
  { label: 'One lowercase character', key: 'lowercaseError' },
  { label: 'One special character', key: 'specialError' },
  { label: 'One number', key: 'numberError' },
  { label: '8 characters minimum', key: 'lengthError' },
];

interface SignPassWordCheck {
  password: string;
  passwordError: ForgetPassword;
}

export const SignPassWordCheck = ({
  password,
  passwordError,
}: SignPassWordCheck) => {
  return (
    <Fade in={!!password} style={{ display: password ? 'block' : 'none' }}>
      <Box
        color={'#9095A3'}
        component={'ul'}
        fontSize={'12px'}
        lineHeight={'1.5'}
        ml={'10px'}
        my={0}
        p={0}
      >
        <Typography color={'info.main'} fontSize={'12px'} variant={'body2'}>
          Password requirements:
        </Typography>
        {ERROR_MESSAGE.map((item, index) => (
          <Box
            component={'li'}
            key={`${item.label}-${item.key}-${index}`}
            sx={{
              ml: 1,
              listStyleType: 'disc',
              listStylePosition: 'inside',
              color: !passwordError[item.key] ? '#E26E6E' : '#369B7C',
              transition: 'color .3s',
            }}
          >
            {item.label}
          </Box>
        ))}
      </Box>
    </Fade>
  );
};
