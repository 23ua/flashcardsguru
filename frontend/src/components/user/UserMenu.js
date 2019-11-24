import React from 'react';
import gql from 'graphql-tag';
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {useMutation, useQuery} from "@apollo/react-hooks";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useHistory } from "react-router-dom";
import Link from "../Link";
import GraphQlError from "../errors/GraphQlError";

UserMenu.propTypes = {};

const GET_USER_INFO = gql`
    query User {
        user {
            username
            temporary
        }
    }
`;

export const SIGN_OUT = gql`
    mutation SignOut {
          signOut {
              username
          }
    }
`;

function UserMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const {data, loading, error} = useQuery(GET_USER_INFO);
    const [signOut, {loading: signOutLoading, error: signOutError}] = useMutation(SIGN_OUT);
    let history = useHistory();

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSignOut = () => {
        handleClose();
        signOut().then(() => location.href = "/");
    };

    let username;
    if (loading || signOutLoading) {
        return (
            <CircularProgress color="secondary" />
        );
    }

    if (!error && data && data.user) {
        username = data.user.username;
    }

    if (!username || data.user.temporary) {
        return <Button component={Link} color="inherit" to="/login">Login</Button>;
    }

    return (
        <>
            <Button aria-controls="simple-menu" aria-haspopup="true" color="inherit" onClick={handleClick}>
                {username}
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem
                    onClick={() => {
                        handleClose();
                        history.push("/profile");
                    }}
                >
                    Profile
                </MenuItem>
                <MenuItem onClick={handleSignOut}>Logout</MenuItem>
            </Menu>
            <GraphQlError error={signOutError} context="Failed to sign out" />
        </>
    );
}

export default UserMenu;