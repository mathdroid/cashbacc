import App from "next/app";
import Head from "next/head";
import { ThemeProvider, ColorModeProvider, CSSReset } from "@chakra-ui/core";
import { initAnalytics } from "@pinjollist/next-with-analytics";

import theme from "../theme";

const options = {
  trackingCode: process.env.GOOGLE_ANALYTICS || "",
  respectDNT: true
};

const analyticsInstance = initAnalytics(options);

class EnhancedApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    const { analytics } = analyticsInstance;
    return (
      <>
        <Head>
          <title>Cashbacc: Aplikasi Penghitung Cashback</title>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
        </Head>
        <ThemeProvider theme={theme}>
          <CSSReset />
          <ColorModeProvider>
            <Component analytics={analytics} {...pageProps} />
          </ColorModeProvider>
        </ThemeProvider>
      </>
    );
  }
}

export default EnhancedApp;
