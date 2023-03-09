import 'styles/globals.css'
import type { AppProps } from 'next/app'

import { ComposeProvider } from '@utils';
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from '@mui/material'
import { lightTheme } from '@Themes'
import { SWRConfig } from 'swr'
import { AuthProvider, CartProvider, UiProvider } from '@context'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <SWRConfig
        value={{
          /*NOTE: Intervalo de peticion OPCIONAL */
          //refreshInterval: 500,
          fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
        }}
      >
        <ComposeProvider components={[
          AuthProvider,
          UiProvider,
          CartProvider,
        ]}>
            <ThemeProvider theme={ lightTheme }>
              <Component {...pageProps} />
            </ThemeProvider>
        </ComposeProvider>
      </SWRConfig>
    </SessionProvider>
  )
}
