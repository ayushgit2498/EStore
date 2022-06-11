import { ThemeProvider } from "@emotion/react";
import { Container, createTheme, CssBaseline } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Catalog from "../../features/catalog/Catalog";
import ProductDetails from "../../features/catalog/ProductDetails";
import AboutPage from "../about/AboutPage";
import ContactPage from "../contact/ContactPage";
import HomePage from "../home/HomePage";
import NavHeader from "./NavHeader";

import "react-toastify/dist/ReactToastify.css";
import ServerError from "../error/ServerError";
import NotFound from "../error/NotFound";
import BasketPage from "../../features/basket/BasketPage";
import LoadingComponent from "./LoadingComponent";
import CheckoutPage from "../../features/checkout/CheckoutPage";
import { useAppDispatch } from "../store/configureStore";
import { fetchBasketAsync } from "../store/basketSlice";
import Login from "../../features/Account/Login";
import Register from "../../features/Account/Register";
import { fetchCurrentUser } from "../store/accountSlice";
import PrivateRoute from "./PrivateRoute";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();

  const [darkMode, setDarkMode] = useState(true);
  const paletteType = darkMode ? "dark" : "light";
  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === "light" ? "#eaeaea" : "#011201",
      },
    },
  });

  const initApp = useCallback(async () => {
    try {
      await dispatch(fetchCurrentUser());
      await dispatch(fetchBasketAsync());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    initApp().then(() => setIsLoading(false));
  }, [initApp]);

  if (isLoading) {
    return (
      <LoadingComponent message="Initializing Application..."></LoadingComponent>
    );
  }
  const changeThemeHandler = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <CssBaseline />
      <NavHeader darkMode={darkMode} changeTheme={changeThemeHandler} />
      <Container>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/catalog" component={Catalog} />
          <Route exact path="/catalog/:id" component={ProductDetails} />
          <Route exact path="/about" component={AboutPage} />
          <Route exact path="/contact" component={ContactPage} />
          <Route exact path="/server-error" component={ServerError} />
          <Route exact path="/basket" component={BasketPage} />
          <PrivateRoute exact path="/checkout" component={CheckoutPage} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route component={NotFound} />
        </Switch>
      </Container>
    </ThemeProvider>
  );
};

export default App;
