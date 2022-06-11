import { Button, Menu, Fade, MenuItem } from "@mui/material";
import { useState } from "react";
import { signOut } from "../store/accountSlice";
import { clearBasket } from "../store/basketSlice";
import { useAppDispatch, useAppSelector } from "../store/configureStore";

const SignedInMenu = () => {
  const { user } = useAppSelector((state) => state.account);
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button onClick={handleClick} color="inherit" sx={{ typography: "h6" }}>
        {user?.email}
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem
          onClick={() => {
            dispatch(clearBasket());
            dispatch(signOut());
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
};

export default SignedInMenu;
