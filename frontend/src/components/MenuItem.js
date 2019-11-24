import React from 'react';
import PropTypes from 'prop-types';
import {ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import { useHistory } from "react-router-dom";

MenuItem.propTypes = {
    text: PropTypes.string.isRequired,
    icon: PropTypes.element.isRequired,
    link: PropTypes.string.isRequired,
};



function MenuItem({ text, icon, link }) {
    let history = useHistory();

    function handleClick() {
        history.push(link);
    }

    return (
        <ListItem button key={text} onClick={handleClick}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText disableTypography primary={text} />
        </ListItem>
    );
}

export default MenuItem;