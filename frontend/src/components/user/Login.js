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

const AUTHENTICATE = gql`
    mutation Authenticate($username: String!, $password: String!) {
        authenticate(username: $username, password: $password) {
            username
        }
    }
`;

function Login() {


    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [authenticateMutation, { data, loading, error }] = useMutation(AUTHENTICATE);

    function handleSubmit(e) {
        e.preventDefault();
        authenticateMutation({variables: { username, password }})
    }

    if (!loading && data && data.authenticate.username) {
        location.href = "/";
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
                        <GraphQlError error={error} context="Login failed" />
                        {loading ?
                            <CircularProgress size={36} /> :
                            <Button color="primary" variant="contained" type="submit">Login</Button>}
                        <Box m={1}>
                            <Link size="small" variant="body2" to="/password-restore">Forgot password?</Link>
                        </Box>
                    </Grid>
                </form>
                <Box m={2}>
                    <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="center"
                    >
                        <Typography variant="body2">
                            Don't have an account?
                            <Box m={1} component="span">
                                <Button component={Link} color="secondary" size="small" to="/signup" >
                                    Sign up
                                </Button>
                            </Box>
                        </Typography>
                    </Grid>
                </Box>
            </Box>
        </Grid>
    );
}

Login.propTypes = {};

export default Login;