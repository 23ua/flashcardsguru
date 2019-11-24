import React from 'react';
import PropTypes from 'prop-types';
import {Box, CircularProgress, Table, TableCell, TableRow, Typography} from "@material-ui/core";
import {useQuery} from "@apollo/react-hooks";
import gql from 'graphql-tag';

Profile.propTypes = {

};

const GET_FULL_USER_INFO = gql`
    query UserInfoFull {
        user {
            username
            temporary
            email
            lastLogin
            dateJoined
        }
    }
`;

function Profile() {
    const {data, loading, error} = useQuery(GET_FULL_USER_INFO);

    if (loading) {
        return <CircularProgress />
    }

    let user;
    if (!error && data && data.user) {
        user = data.user;
    }

    return (
        <Box>
            <Box mb={4}>
                <Typography variant="h4">
                    Profile
                </Typography>
            </Box>
            <Table size="small">
                <TableRow hover>
                    <TableCell>
                        <Typography variant="subtitle1">username</Typography>
                    </TableCell>
                    <TableCell>
                        <Typography variant="subtitle1" color="primary">{user.username}</Typography>
                    </TableCell>
                </TableRow>
                <TableRow hover>
                    <TableCell>
                        <Typography variant="subtitle1">email:</Typography>
                    </TableCell>
                    <TableCell>
                        <Typography variant="subtitle1" color="primary">{user.email}</Typography>
                    </TableCell>
                </TableRow>
                <TableRow hover>
                    <TableCell>
                        <Typography variant="subtitle1">registration date:</Typography>
                    </TableCell>
                    <TableCell>
                        <Typography variant="subtitle1" color="primary">{new Date(user.lastLogin).toString()}</Typography>
                    </TableCell>
                </TableRow>
                <TableRow hover>
                    <TableCell>
                        <Typography variant="subtitle1">last login:</Typography>
                    </TableCell>
                    <TableCell>
                        <Typography variant="subtitle1" color="primary">{new Date(user.lastLogin).toString()}</Typography>
                    </TableCell>
                </TableRow>
            </Table>
        </Box>
    );
}

export default Profile;