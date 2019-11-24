import React from 'react';
import { Typography, Grid } from "@material-ui/core";
import { useParams } from "react-router-dom";
import gql from 'graphql-tag';
import { useQuery } from "@apollo/react-hooks";
import GraphQlError from "./errors/GraphQlError"
import CircularProgress from "@material-ui/core/CircularProgress";
import FlashcardPreview from "./FlashcardPreview";

Deck.propTypes = {};

export const GET_DECK_WITH_CARDS = gql`
    query Deck($id: ID!) {
        deck(id: $id) {
            id
            name
            flashcardSet {
                id
                phrase
                meaning {
                    id
                    definition
                    examples
                    wordClass
                }
            }
        }
    }
`;

export const GET_DEFAULT_DECK_WITH_CARDS = gql`
    query DefaultDeck {
        deck(default: true) {
            id
            name
            flashcardSet {
                id
                phrase
                meaning {
                    id
                    definition
                    examples
                    wordClass
                }
            }
        }
    }
`;


function Deck() {
    const {id} = useParams();
    const {data, loading, error} = useQuery(GET_DECK_WITH_CARDS, {variables: { id }});

    if (loading) {
        return <CircularProgress/>;
    }

    if (!data && !loading) {
        return <Typography variant="body1" color="secondary">Deck not found :(</Typography>
    }

    const { deck } = data;

    const {flashcardSet: _, ...deckOnly} = deck;

    return (
        <>
            <Typography variant="h3">{deck.name}</Typography>
            <Typography variant="subtitle2" color="textSecondary" style={{marginBottom: 20}}>
                {deck.flashcardSet.length} cards
            </Typography>
            <Grid container>
                {deck.flashcardSet.map(card => {
                    const cardWithDeck = {...card, deck: deckOnly};
                    return(
                        <Grid item md={3} key={card.id} style={{margin: 20}}>
                            <FlashcardPreview card={cardWithDeck} deckView />
                        </Grid>
                    );
                })}
            </Grid>
            <GraphQlError error={error} context="Failed to fetch deck"/>
        </>
    );
}

export default Deck;