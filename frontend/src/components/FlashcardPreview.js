import React from 'react';
import PropTypes, {bool} from 'prop-types';
import gql from 'graphql-tag';
import { useParams, useHistory } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/react-hooks";
import GraphQlError from "./errors/GraphQlError"
import { Box, Button, Card, CardActions, CardContent, CircularProgress, Typography } from "@material-ui/core";
import WordClass from "./WordClass";
import Answer from "./Answer";
import Link from "./Link";
import { GET_PHRASE_PREVIEW } from "./Search";
import { GET_DECK_WITH_CARDS, GET_DEFAULT_DECK_WITH_CARDS } from "./Deck";

FlashcardPreview.propTypes = {
    card: PropTypes.object,
    deckView: bool,
};

FlashcardPreview.defaultValues = {
    deckView: false,
};

export const GET_CARD = gql`
    query Flashcard($id: ID!) {
        flashcard(id: $id) {
            id
            phrase
            meaning {
                id
                definition
                examples
                wordClass
            }
            deck {
                id
                name
            }
        }
    }
`;

export const DELETE_FLASHCARD_MUTATION = gql`
    mutation DeleteFlashcard($input: DeleteFlashcardMutationInput!) {
        deleteFlashcard(input: $input) {
            flashcard {
                phrase
            }
        }
    }
`;

function FlashcardPreview({ card, deckView }) {
    const { cardId } = useParams();
    let history = useHistory();
    const [delFlashcardMutation, delMutationRes] = useMutation(DELETE_FLASHCARD_MUTATION);
    const { data: delMutationData, loading: delMutationLoading, error: delMutationError } = delMutationRes;

    if (!card) {
        var { data, loading, error } = useQuery(GET_CARD, {variables: {id: cardId}});
    }

    if (loading) {
        return <CircularProgress />
    }

    if (error) {
        return <GraphQlError error={error} context="Failed to fetch flashcard info from server" />;
    }

    if (!card) {
        card = data.flashcard;
    }

    const { phrase } = card;
    const { examples, wordClass, definition, id: meaningId } = card.meaning;
    const cacheResetConfig = [
        {query: GET_PHRASE_PREVIEW, variables: { phrase }},
        {query: GET_CARD, variables: { id: card.id }},
        {query: GET_DECK_WITH_CARDS, variables: { id: card.deck.id }},
        {query: GET_DEFAULT_DECK_WITH_CARDS},
    ];


    if (!delMutationLoading && delMutationData && delMutationData.deleteFlashcard.flashcard.phrase) {
        if (!deckView) {
            history.push(`/deck/${card.deck.id}`);
        }
    }

    const handleDelete = () => {
        delFlashcardMutation({
            variables: {input: { phrase, meaningId }},
            refetchQueries: cacheResetConfig,
        });
    };

    const phraseNode = (
        <Typography color="textSecondary" paragraph={false} component="span">
            {card.phrase}
        </Typography>
    );

    return (
        <Card>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    {deckView
                        ? <Link to={`/flashcard/${card.id}`}>{phraseNode}</Link>
                        : phraseNode
                    }
                    {!deckView &&
                        <Typography variant="subtitle2">
                            Deck: <Link to={`/deck/${card.deck.id}`}>{card.deck.name}</Link>
                        </Typography>
                    }
                </Box>
                <WordClass code={wordClass}/>
                <Answer definition={definition} examples={examples} phrase={card.phrase} />
            </CardContent>
            <CardActions style={{ justifyContent: 'flex-end' }}>
                <Button
                    size="small"
                    color="secondary"
                    onClick={handleDelete}
                >
                    Delete
                </Button>
            </CardActions>
        </Card>
    );
}

export default FlashcardPreview;