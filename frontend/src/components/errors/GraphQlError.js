import React from 'react';
import PropTypes from 'prop-types';
import ErrorSnackbar from './ErrorSnackbar';
import ApolloError from '@apollo/react-hooks';

GraphQlError.propTypes = {
    error: PropTypes.instanceOf(ApolloError),
    context: PropTypes.string,
};

function GraphQlError({ error, context }) {
    let errorMessage;
    if (error && error.graphQLErrors.length > 0) {
        errorMessage = error.graphQLErrors[0].message;
    } else if (error && error.hasOwnProperty('message')) {
        errorMessage = error.message;
    } else if (error) {
        console.error("Unexpected error:", JSON.stringify(error));
        errorMessage = "Unknown error";
    } else {
        return null;
    }

    const message = context ? `${context}: ${errorMessage}` : errorMessage;

    return (
        <ErrorSnackbar message={message} />
    );
}

export default GraphQlError;