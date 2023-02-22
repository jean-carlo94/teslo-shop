import 'styles/globals.css'
import type { AppProps } from 'next/app'

import { ComposeProvider } from '@utils';

import { ThemeProvider } from '@mui/material'
import { lightTheme } from '@Themes'
import { SWRConfig } from 'swr'
import { CartProvider, UiProvider } from '@context'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        /*NOTE: Intervalp de peticion OPCIONAL */
        //refreshInterval: 500,
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}
    >
      <ComposeProvider components={[
        UiProvider,
        CartProvider
      ]}>
          <ThemeProvider theme={ lightTheme }>
            <Component {...pageProps} />
          </ThemeProvider>
      </ComposeProvider>
    </SWRConfig>
  )
}
