import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    blue: "#007FFF",
    grey: {
      100: "#F5F7F9",
      200: "#C6CFDC",
      300: "#8D9CB8",
    },
    red: "#FF5E5E",
  },
});

export default extendTheme(theme);
