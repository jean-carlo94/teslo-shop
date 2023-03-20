import 'styles/globals.css'
import type { AppProps } from 'next/app'

import { ComposeProvider } from '@utils';
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from '@mui/material'
import { lightTheme } from '@Themes'
import { SWRConfig } from 'swr'
import { AuthProvider, CartProvider, ProductsProvider, UiProvider, UsersProvider } from '@context'
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <PayPalScriptProvider options={{ 'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '' }}>
        <SWRConfig
          value={{
            /*NOTE: Intervalo de petición OPCIONAL */
            //refreshInterval: 500,
            fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
          }}
        >
          <ComposeProvider components={[
            AuthProvider,
            UiProvider,
            CartProvider,
            UsersProvider,
            ProductsProvider,
          ]}>
              <ThemeProvider theme={ lightTheme }>
                <Component {...pageProps} />
              </ThemeProvider>
          </ComposeProvider>
        </SWRConfig>
      </PayPalScriptProvider>
    </SessionProvider>
  )
}
