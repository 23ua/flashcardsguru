import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField, IconButton, CircularProgress, Tooltip,
} from "@material-ui/core";

import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import { GET_MY_DECKS } from './MyDecks';

import gql from 'graphql-tag';
import {useMutation, useQuery} from "@apollo/react-hooks";
import GraphQlError from "./errors/GraphQlError"
import ServerValidationErrors from "./errors/ServerValidationErrors";


DeckFormDialog.propTypes = {
    oldName: PropTypes.string,
    edit: PropTypes.bool
};

DeckFormDialog.defaultProps = {
    edit: false
};


const DECK_MUTATION = gql`
    mutation Deck($input: DeckMutationInput!) {
        deck(input: $input) {
            deck {
                id
                name
                created
            },
            errors {
                field
                messages
            }
        }
    }
`;


function DeckFormDialog({ deck, edit }) {
    const currentDeckName = deck ? deck.name : "";
    const isDefaultDeck = deck ? deck.default : false;
    const [name, setName] = useState(currentDeckName);
    const [open, setOpen] = React.useState(false);

    function handleClose() {
        setOpen(false);
    }

    function handleOpen() {
        setOpen(true);
    }

    let openDialogButton;
    if (edit) {
        openDialogButton = (
            <Tooltip title="Edit">
                <IconButton edge="end" aria-label="edit" onClick={handleOpen}>
                    <EditIcon />
                </IconButton>
            </Tooltip>
        );
    } else {
        openDialogButton = (
            <Button variant="contained" color="secondary" endIcon={<AddIcon/>} onClick={handleOpen}>
                New deck
            </Button>
        );
    }

    const [deckMutation, { data, loading, error }] = useMutation(DECK_MUTATION);

    function handleSubmit(e) {
        e.preventDefault();

        if (currentDeckName === name) {
            handleClose();
            return;
        }

        const id = deck ? deck.id : null;
        deckMutation({
            variables: {input: { name, id, default: isDefaultDeck }},
            refetchQueries: [{query: GET_MY_DECKS}],
        }).then(({ error, data: { deck } }) => {
            if (!error && !deck.errors && !edit) {
                setName("")
            }

            if (!error && !deck.errors) {
                handleClose()
            }
        })
    }

    return (
        <>
            {openDialogButton}
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{edit ? 'Edit Deck' : 'Add new Deck'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Deck name"
                        fullWidth
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        autoFocus={true}
                        margin="dense"
                    />
                    {loading && <CircularProgress />}

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        {edit ? 'Edit' : 'Add'}
                    </Button>
                    <GraphQlError error={error} context="Failed to save Deck" />
                    {data && <ServerValidationErrors errors={data.deck.errors} />}
                </DialogActions>
            </Dialog>
        </>
    );
}

export default DeckFormDialog;