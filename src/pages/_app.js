import App from "next/app";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";

import theme from "../theme";

class EnhancedApp extends App {
  render() {
    const { Component } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <CSSReset />
        <Component />
      </ThemeProvider>
    );
  }
}

export default EnhancedApp;
