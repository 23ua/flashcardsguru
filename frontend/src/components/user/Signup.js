import React, {Component, useState} from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";

import Link from '../Link';

import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import {Redirect} from "react-router-dom";
import ErrorSnackbar from "../errors/ErrorSnackbar";
import GraphQlError from "../errors/GraphQlError";

const SIGNUP = gql`
    mutation SignUp($username: String!, $email: String!, $password: String!) {
        signup(username: $username, email: $email, password: $password) {
            username
        }
    }
`;

function Signup(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [signupMutation, { data, loading, error }] = useMutation(SIGNUP);

    function handleSubmit(e) {
        e.preventDefault();
        signupMutation({variables: { username, password, email }})
            .then(() => location.href = "/")
    }

    if (!loading && data && data.signup.username) {
        return <Redirect to="/" />;
    }


    return (
        <Grid container justify="center">
            <Box maxWidth={280} mt={3}>
                <form onSubmit={handleSubmit}>
                    <Box>
                        <TextField
                            label="Username"
                            autoComplete="username"
                            margin="normal"
                            fullWidth={true}
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            name="username"
                            required
                            autoFocus={true}
                        />
                    </Box>
                    <Box>
                        <TextField
                            label="Email"
                            autoComplete="email"
                            margin="normal"
                            fullWidth={true}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            name="email"
                            required
                        />
                    </Box>
                    <Box mb={1}>
                        <TextField
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            margin="normal"
                            fullWidth={true}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            name="password"
                            required
                          />
                    </Box>
                    <Grid
                      container
                      direction="row"
                      justify="center"
                      alignItems="center"
                    >
                        <GraphQlError error={error} context="Signup failed" />
                        {loading ?
                            <CircularProgress size={36} /> :
                            <Button color="primary" variant="contained" type="submit">Signup</Button>}
                    </Grid>
                </form>
            </Box>
        </Grid>
    );
}

Signup.propTypes = {};

export default Signup;