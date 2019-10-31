import App from "next/app";
import Head from "next/head";
import { ThemeProvider, ColorModeProvider, CSSReset } from "@chakra-ui/core";

import theme from "../theme";

class EnhancedApp extends App {
  render() {
    const { Component } = this.props;
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
            <Component />
          </ColorModeProvider>
        </ThemeProvider>
      </>
    );
  }
}

export default EnhancedApp;
