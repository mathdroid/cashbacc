import App from "next/app";
import { ThemeProvider, ColorModeProvider, CSSReset } from "@chakra-ui/core";

import theme from "../theme";

class EnhancedApp extends App {
  render() {
    const { Component } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <CSSReset />
        <ColorModeProvider>
          <Component />
        </ColorModeProvider>
      </ThemeProvider>
    );
  }
}

export default EnhancedApp;
