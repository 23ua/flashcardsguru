import React from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    ListItemIcon,
    IconButton,
    Tooltip
} from "@material-ui/core";
import DeckFormDialog from "./DeckFormDialog";
import gql from 'graphql-tag';
import {useMutation, useQuery} from "@apollo/react-hooks";
import GraphQlError from "./errors/GraphQlError";
import CircularProgress from "@material-ui/core/CircularProgress";
import {useHistory} from "react-router-dom";
import DeleteIcon from '@material-ui/icons/Delete';
import CasinoIcon from '@material-ui/icons/Casino';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';


MyDecks.propTypes = {};


export const GET_MY_DECKS = gql`
    query MyDecks {
        myDecks {
            id
            name
            created
            default
        }
    }
`;

export const DELETE_DECK = gql`
    mutation DeleteDeck($input: DeleteDeckMutationInput!) {
        deleteDeck(input: $input) {
            deck {
                id
            }
        }
    }
`;

const DECK_MUTATION = gql`
    mutation Deck($input: DeckMutationInput!) {
        deck(input: $input) {
            errors {
                field
                messages
            }
        }
    }
`;


function MyDecks() {
    const {data, loading, error} = useQuery(GET_MY_DECKS);
    const [deleteDeck, delDeckMutationResult] = useMutation(DELETE_DECK);
    const {loading: delLoading, error: delError} = delDeckMutationResult;
    const [changeDeck, {error: changeError, loading: changeLoading}] = useMutation(DECK_MUTATION);
    let history = useHistory();

    if (loading) {
        return <CircularProgress/>;
    }

    const myDecks = data ? data.myDecks : [];

    return (
        <>
            <DeckFormDialog/>
            <List component="nav">
                {myDecks.map(d => (
                    <ListItem button key={d.id} onClick={() => history.push(`/deck/${d.id}`)}>
                        {d.default && !changeLoading &&
                            <Tooltip title="Default deck">
                                <ListItemIcon>
                                    <StarIcon />
                                </ListItemIcon>
                            </Tooltip>
                        }
                        {!d.default && !changeLoading &&
                            <Tooltip title="Make default">
                                <ListItemIcon onClick={(e) => {
                                    e.stopPropagation();
                                    changeDeck({
                                        variables: {input: {id: d.id, default: true, name: d.name}},
                                        refetchQueries: [{query: GET_MY_DECKS}],
                                    })
                                }}>
                                    <StarBorderIcon />
                                </ListItemIcon>
                            </Tooltip>
                        }
                        {changeLoading &&
                            <ListItemIcon>
                                <CircularProgress />
                            </ListItemIcon>
                        }
                        <ListItemText primary={d.name}/>
                        <ListItemSecondaryAction>
                            <Tooltip title="Learn">
                                <IconButton
                                    edge="end"
                                    aria-label="challenge"
                                    onClick={() => history.push(`/challenge/${d.id}`)}
                                >
                                    <CasinoIcon/>
                                </IconButton>
                            </Tooltip>
                            <DeckFormDialog edit deck={d}/>
                            {!delLoading
                                ? <Tooltip title="Delete">
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => (
                                            deleteDeck({
                                                variables: {input: {id: d.id}},
                                                refetchQueries: [{query: GET_MY_DECKS}],
                                            })
                                        )}
                                    >
                                        <DeleteIcon/>
                                    </IconButton>
                                </Tooltip>
                                : <CircularProgress/>
                            }
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
            <GraphQlError error={error} context="Failed to fetch a list of decks from server"/>
            <GraphQlError error={delError} context="Failed to delete deck"/>
            <GraphQlError error={changeError} context="Failed to update deck"/>
        </>
    );
}

export default MyDecks;
