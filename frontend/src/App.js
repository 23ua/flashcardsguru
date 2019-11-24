import React, {Component} from 'react';
import { StylesProvider } from '@material-ui/core/styles';

import Layout from "./components/Layout";
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const client = new ApolloClient({
  uri: '/graphql',
});

function App() {
    return (
        <StylesProvider injectFirst>
            <ApolloProvider client={client}>
                <Router>
                    <Layout />
                </Router>
            </ApolloProvider>
        </StylesProvider>
    );
}

export default App;