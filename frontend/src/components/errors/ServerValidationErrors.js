import React from 'react';
import PropTypes from 'prop-types';
import ErrorSnackbar from './ErrorSnackbar';

ServerValidationErrors.propTypes = {
    errors: PropTypes.array,
    context: PropTypes.string,
};

function ServerValidationErrors({ errors, context }) {
    if (!errors || errors.length === 0) {
        return null;
    }
    let errorMessage = "";

    for (let error of errors) {
        for (let message of error.messages) {
            errorMessage += `${message} `;
        }
    }

    const message = context ? `${context}: ${errorMessage}` : errorMessage;

    return (
        <ErrorSnackbar message={message} />
    );
}

export default ServerValidationErrors;