import { ShoppingCart } from "@mui/icons-material";
import {
  AppBar,
  Badge,
  Box,
  IconButton,
  List,
  ListItem,
  Switch,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { useStoreContext } from "../context/StoreContext";
import { useAppSelector } from "../store/configureStore";
import SignedInMenu from "./SignedInMenu";

const NavHeader = (props: any) => {
  const { user } = useAppSelector((state) => state.account);
  const { basket } = useAppSelector((state) => state.basket);

  const midLinks = [
    { title: "CATALOG", path: "/catalog" },
    { title: "ABOUT", path: "/about" },
    { title: "CONTACT", path: "/contact" },
  ];

  const rightLinks = [
    { title: "LOGIN", path: "/login" },
    { title: "Register", path: "/register" },
  ];

  const navStyles = {
    color: "inherit",
    typography: "h6",
    "&:hover": {
      color: "grey.500",
    },
    "&.active": {
      color: "text.secondary",
    },
  };

  const basketItemCount = basket?.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            variant="h5"
            component={NavLink}
            to="/"
            sx={navStyles}
            exact
          >
            E-Store
          </Typography>
          <Switch checked={props.darkMode} onChange={props.changeTheme} />
        </Box>
        <Box>
          <List sx={{ display: "flex" }}>
            {midLinks.map(({ title, path }) => (
              <ListItem component={NavLink} to={path} key={path} sx={navStyles}>
                {title}
              </ListItem>
            ))}
          </List>
        </Box>
        <Box display="flex" alignItems="center">
          <IconButton
            component={Link}
            to="/basket"
            size="large"
            sx={{ color: "inherit" }}
          >
            <Badge badgeContent={basketItemCount} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>
          {user ? (
            <SignedInMenu />
          ) : (
            <List sx={{ display: "flex" }}>
              {rightLinks.map(({ title, path }) => (
                <ListItem
                  component={NavLink}
                  to={path}
                  key={path}
                  sx={navStyles}
                >
                  {title}
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavHeader;
