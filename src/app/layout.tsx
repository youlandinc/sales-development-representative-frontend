'use client';
import { ReactNode } from 'react';
import { Red_Hat_Display } from 'next/font/google';

import NextTopLoader from 'nextjs-toploader';
import { CssBaseline, ThemeProvider } from '@mui/material';

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import { UserStoreProvider } from '@/provides';

import '@/styles/global.css';

import { lightTheme } from '@/theme';

import { ToastProvider } from '@/provides/ToastProvider';

const redHatDisplay = Red_Hat_Display({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-red-hat-display',
});

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="/favicon.svg" rel="icon" sizes={'any'} />
        <title>Attune</title>
      </head>
      <body className={redHatDisplay.variable}>
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
              <ToastProvider />
              <UserStoreProvider>{children}</UserStoreProvider>
            </ThemeProvider>
          </LocalizationProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default RootLayout;
