import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Typography, Box, Button, Popover, CircularProgress} from "@material-ui/core";
import { useMutation } from "@apollo/react-hooks";
import gql from 'graphql-tag';
import GraphQlError from "./errors/GraphQlError";
import { GET_PHRASE_PREVIEW } from './Search';
import Answer from "./Answer";
import WordClass from "./WordClass";
import { DELETE_FLASHCARD_MUTATION } from "./FlashcardPreview";

NewFlashcardMeaning.propTypes = {
    phrase: PropTypes.string.isRequired,
    wordClass: PropTypes.string.isRequired,
    definition: PropTypes.string.isRequired,
    examples: PropTypes.arrayOf(PropTypes.string).isRequired,
    saved: PropTypes.bool,
    autoSave: PropTypes.bool,
};

NewFlashcardMeaning.defaultValues = {
    saved: false,
    autoSave: false,
};

const FLASHCARD_MUTATION = gql`
    mutation Flashcard($input: FlashcardMutationInput!) {
        flashcard(input: $input) {
            errors {
                field
                messages
            }
        }
    }
`;


function NewFlashcardMeaning({ phrase, wordClass, definition, examples, meaningId, saved, autoSave }) {
    const [flashcardMutation, { mutationData, mutationLoading, mutationError }] = useMutation(FLASHCARD_MUTATION);
    const [delFlashcardMutation, delMutationRes] = useMutation(DELETE_FLASHCARD_MUTATION);
    const { delMutationData, delMutationLoading, delMutationError } = delMutationRes;

    const cacheResetConfig = [{query: GET_PHRASE_PREVIEW, variables: { phrase }}];


    // autosave flashcard on page preview load if needed
    useEffect(() => {
        if (autoSave) {
            const variables = { phrase, meaningId, autoAdd: true };
            flashcardMutation({
                variables: {input: variables},
                refetchQueries: cacheResetConfig,
            });
        }
    }, []);

    const toggleFlashcard = () => {
        if (saved) {
            const variables = { phrase, meaningId };
            delFlashcardMutation({
                variables: {input: variables},
                refetchQueries: cacheResetConfig,
            });
            // delete
        } else {
            const variables = { phrase, meaningId, autoAdd: false };
            flashcardMutation({
                variables: {input: variables},
                refetchQueries: cacheResetConfig,
            });
        }
    };

    return (
        <>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography color="textSecondary" paragraph={false} component="span">{phrase}</Typography>
                {!delMutationLoading && !mutationLoading &&
                    <Button color={saved ? 'secondary' : 'primary'} size="small" onClick={toggleFlashcard} >
                        {saved ? 'Remove word' : 'Choose this meaning'}
                    </Button>
                }
                {delMutationLoading || mutationLoading &&
                    <CircularProgress />
                }
            </Box>
            <WordClass code={wordClass}/>
            <Answer definition={definition} examples={examples} phrase={phrase} />
            <GraphQlError error={mutationError} context="Choosing meaning request failed" />
            <GraphQlError error={delMutationError} context="Flashcard deletion failed" />
        </>
    );
}

export default NewFlashcardMeaning;