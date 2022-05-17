import { ThemeProvider } from "@emotion/react";
import { Container, createTheme, CssBaseline } from "@mui/material";
import { useState } from "react";
import Catalog from "../../features/catalog/Catalog";
import NavHeader from "./NavHeader";

const App = () => {
  
  const [darkMode, setDarkMode] = useState(true);
  const paletteType = darkMode ? "dark" : "light";
  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === 'light' ? '#eaeaea' : '#011201'
      }
    }
  });

  const changeThemeHandler = () => {
    setDarkMode(prev => !prev);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavHeader darkMode={darkMode} changeTheme={changeThemeHandler}/>
      <Container>
        <Catalog />
      </Container>
    </ThemeProvider>
  );
};

export default App;
