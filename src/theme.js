// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#00ADB4", // cyan
      
      dark: "#212832", // navy
      light: "#393D46", // dark gray
      lightWight:'#F5F8FE', //for testimonial cards
    },
    background: {
      default: "#212832",
    },
    text: {
      primary: "#ffffff",
    },
  },
});

export default theme;
