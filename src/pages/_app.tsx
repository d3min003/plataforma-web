import * as React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeModeProvider } from '@/theme/ThemeModeProvider';
import { roboto } from '@/theme/fonts';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeModeProvider>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <div className={roboto.className}>
        <Component {...pageProps} />
      </div>
    </ThemeModeProvider>
  );
}
