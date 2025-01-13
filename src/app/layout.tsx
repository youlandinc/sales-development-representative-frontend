'use client';
import { ReactNode } from 'react';

import NextTopLoader from 'nextjs-toploader';
import { Container, CssBaseline, ThemeProvider } from '@mui/material';

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

import { useRouter } from 'nextjs-toploader/app';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import { UserStoreProvider } from '@/provides';

import '@/styles/global.css';

import { lightTheme } from '@/theme';
import { useBreakpoints } from '@/hooks';

import { StyledButton } from '@/components/atoms';

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const router = useRouter();
  const breakpoints = useBreakpoints();

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
        <AppRouterCacheProvider
          options={{ key: 'css', enableCssLayer: true, prepend: true }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <ThemeProvider theme={lightTheme}>
              <CssBaseline />
              <UserStoreProvider>
                <Container>
                  <StyledButton onClick={() => router.push('/auth/sign-in')}>
                    sign in
                  </StyledButton>
                  <StyledButton
                    onClick={() => router.push('/auth/forget-password')}
                    variant={'outlined'}
                  >
                    forget password
                  </StyledButton>
                  <StyledButton
                    onClick={() => router.push('/auth/set-password')}
                    variant={'outlined'}
                  >
                    set password
                  </StyledButton>
                  <StyledButton
                    onClick={() => router.push('/')}
                    variant={'text'}
                  >
                    home
                  </StyledButton>
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
