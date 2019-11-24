import React, {useEffect, useState} from 'react';
import { useLazyQuery } from "@apollo/react-hooks";
import gql from 'graphql-tag';
import GraphQlError from "./errors/GraphQlError";
import SearchField from "./SearchField";
import {CircularProgress, Box, Button} from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import NewFlashcard from "./NewFlashcard";

Search.propTypes = {};

export const GET_PHRASE_PREVIEW = gql`
    query PhrasePreview($phrase: String!) {
        phrasePreview(phrase: $phrase) {
            phrase
            meanings {
                id
                definition
                examples
                wordClass
            }
            savedMeaningId
        }
    }
`;


function Search() {
    let { phrase: initialPhrase } = useParams();
    if (initialPhrase) {
        initialPhrase = initialPhrase.toLowerCase();
    }
    const [phrase, setPhrase] = useState(initialPhrase || '');
    const [phrasePreview, setPhrasePreview] = useState(null);
    let history = useHistory();

    const [getPhrasePreview, { data, loading, error }] = useLazyQuery(GET_PHRASE_PREVIEW);

    // init flashcard on page load
    useEffect(() => {
        if (initialPhrase) {
            getPhrasePreview({variables: { phrase: initialPhrase }});
        }
    }, []);

    if (data && data.phrasePreview && data.phrasePreview !== phrasePreview) {
        setPhrasePreview(data.phrasePreview);
    }

    return (
        <>
            <SearchField
                defaultValue={phrase}
                onChoose={v => {
                    const newPhrase = v.toLowerCase();
                    setPhrase(newPhrase);
                    if (newPhrase) {
                        getPhrasePreview({variables: { phrase: newPhrase }});
                        history.push(`/search/${newPhrase}`);
                    }
                }}
            />
            {loading && <CircularProgress />}
            {phrasePreview && <NewFlashcard card={phrasePreview} autoSave />}
            <GraphQlError error={error} context="Failed to fetch word meanings" />
        </>
    );
}

export default Search;