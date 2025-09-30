'use client';
import { ReactNode } from 'react';
import { Inter } from 'next/font/google';

import NextTopLoader from 'nextjs-toploader';
import { CssBaseline, ThemeProvider } from '@mui/material';

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import { UserStoreProvider } from '@/providers';

import '@/styles/global.css';

import { lightTheme } from '@/theme';

import { ToastProvider } from '@/providers/ToastProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
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
        <title>Corepass</title>
      </head>
      <body className={inter.variable}>
        <InitColorSchemeScript attribute="class" />
        <NextTopLoader
          color="#6E4EFB"
          crawl={true}
          height={2}
          shadow={'none'}
          showSpinner={false}
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
