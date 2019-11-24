import React from 'react';
import {makeStyles, useTheme, AppBar} from "@material-ui/core";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import clsx from "clsx";

import {
    Drawer,
    Divider,
    IconButton,
    List,
    Toolbar,
    CssBaseline,
} from "@material-ui/core";
import {ChevronLeft, Menu} from '@material-ui/icons';
import HomeIcon from '@material-ui/icons/Home';
import LayersIcon from '@material-ui/icons/Layers';
import CasinoIcon from '@material-ui/icons/Casino';

import TopPanel from "./TopPanel";
import MenuItem from "../MenuItem";
import Routes from "./Routes";

Layout.propTypes = {};

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    body: {
        width: '100%',
        maxWidth: 800,
    },
}));

function Layout() {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const permanentDrawer = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open,
                        })}
                    >
                        <Menu/>
                    </IconButton>
                    {(permanentDrawer || !open) &&
                        <TopPanel />
                    }
                </Toolbar>
            </AppBar>
            <Drawer
                variant={permanentDrawer ? "permanent" : "temporary"}
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
                open={open}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeft/>
                    </IconButton>
                </div>
                <Divider/>
                <List>
                    <MenuItem text="Home" icon={<HomeIcon/>} link="/"/>
                </List>
                <Divider/>
                <List>
                    <MenuItem text="My Decks" icon={<LayersIcon/>} link="/my-decks"/>
                    <MenuItem text="Learn" icon={<CasinoIcon/>} link="/challenge/"/>
                </List>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar}/>
                <div className={classes.body}>
                    <Routes />
                </div>
            </main>
        </div>
    );
}


export default Layout;