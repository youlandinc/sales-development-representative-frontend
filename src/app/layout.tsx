'use client';
import { ReactNode, useState } from 'react';

import NextTopLoader from 'nextjs-toploader';
import { Container, CssBaseline, Stack, ThemeProvider } from '@mui/material';

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

import { useRouter } from 'nextjs-toploader/app';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import { UserStoreProvider } from '@/provides';

import { lightTheme } from '@/theme';
import { useBreakpoints } from '@/hooks';
import { StyledButton } from '@/components/atoms';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/atoms/StyledOTP/StyledOTP';

import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const router = useRouter();
  const breakpoints = useBreakpoints();

  const [value, setValue] = useState('');

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <InitColorSchemeScript attribute="class" />
        <NextTopLoader
          color="#6E4EFB"
          crawl={true}
          height={2}
          shadow={'none'}
        />
        <AppRouterCacheProvider options={{ key: 'css', enableCssLayer: true }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <ThemeProvider theme={lightTheme}>
              <CssBaseline />
              <UserStoreProvider>
                <Container sx={{ border: '1px solid' }}>
                  <StyledButton onClick={() => router.push('/auth/sign-in')}>
                    sign in
                  </StyledButton>
                  <StyledButton
                    onClick={() => router.push('/auth/forget-password')}
                    variant={'outlined'}
                  >
                    forget password
                  </StyledButton>
                  <Stack>
                    <InputOTP
                      maxLength={4}
                      onChange={(e) => setValue(e)}
                      pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                      value={value}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0}></InputOTPSlot>
                        <InputOTPSlot index={1}></InputOTPSlot>
                        <InputOTPSlot index={2}></InputOTPSlot>
                        <InputOTPSlot index={3}></InputOTPSlot>
                      </InputOTPGroup>
                    </InputOTP>
                  </Stack>
                </Container>
                {children}
              </UserStoreProvider>
            </ThemeProvider>
          </LocalizationProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default RootLayout;
