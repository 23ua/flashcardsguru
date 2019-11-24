import React from 'react';
import PropTypes from 'prop-types';
import {Typography} from "@material-ui/core";

WordClass.propTypes = {
    code: PropTypes.string.isRequired,
};

function WordClass({ code }) {
    return (
        <Typography variant="caption" gutterBottom paragraph>
            {code.toLowerCase().replace('_', ' ')}
        </Typography>
    );
}

export default WordClass;