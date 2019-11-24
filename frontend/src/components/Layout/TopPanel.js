import React from 'react';
import Link from "../Link";
import UserMenu from "../user/UserMenu";
import {Typography} from "@material-ui/core";

TopPanel.propTypes = {};


function TopPanel() {
    return (
        <>
            <Typography variant="h6" style={{flexGrow: 1}}>
                <Link to="/" color="inherit">
                    Flashcards Guru
                </Link>
            </Typography>
            <UserMenu/>
        </>
    );
}

export default TopPanel;