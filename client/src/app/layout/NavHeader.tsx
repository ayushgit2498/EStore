import { AppBar, Switch, Toolbar, Typography } from "@mui/material";

const NavHeader = (props: any) => {
    return (
        <AppBar position="static" sx={{mb: 4}}>
            <Toolbar>
                <Typography variant="h5">
                    E-Store
                </Typography>
                <Switch checked={props.darkMode} onChange={props.changeTheme}/>
            </Toolbar>
        </AppBar>
    )
}

export default NavHeader;