import 'styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material'
import { lightTheme } from '@Themes'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={ lightTheme }>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
