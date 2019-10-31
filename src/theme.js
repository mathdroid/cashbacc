import { theme } from "@chakra-ui/core";

const customTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    brand: {
      400: "#ff8fb4",
      500: "#ff6699",
      600: "#e65c8a"
    }
  }
};

export default customTheme;
