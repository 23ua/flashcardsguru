import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import gql from 'graphql-tag';
import { useQuery } from "@apollo/react-hooks";
import GraphQlError from "./errors/GraphQlError"
import { CircularProgress, Typography, Box } from "@material-ui/core";
import Flashcard from "./Flashcard";
import ChallengeResults from "./ChallengeResults";
import {GET_DECK_WITH_CARDS, GET_DEFAULT_DECK_WITH_CARDS} from "./Deck";
import Link from "./Link";

Challenge.propTypes = {};

export const GET_DEFAULT_DECK = gql`
    query DefaultDeck {
          myDecks(default: true) {
            id
            name
            created
        }
    }
`;

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
}


function Challenge() {
    const { deckId } = useParams();

    let query, variables;
    if (deckId) {
        query = GET_DECK_WITH_CARDS;
        variables = {id: deckId};
    } else {
        query = GET_DEFAULT_DECK_WITH_CARDS;
        variables = {};
    }

    const { data, loading, error } = useQuery(query, { variables });
    const [currentCard, setCurrentCard] = useState(0);
    const [cards, setCards] = useState();
    const [showResults, setShowResult] = useState(false);
    const [results, setResults] = useState({});

    if (loading) {
        return <CircularProgress />
    }

    const deck = data.deck;

    if (!cards && data && deck.flashcardSet) {
        let flashCards = deck.flashcardSet;
        shuffle(flashCards);
        setCards(flashCards);

        return <CircularProgress />
    }

    if (showResults) {
        const { flashcardSet: _, ...deckWithoutCards } = deck;
        return <ChallengeResults cards={cards} results={results} deck={deckWithoutCards} />
    }


    const handleDone = guessed => {
        const newResults = {
            ...results,
            [cards[currentCard].id]: guessed,
        };
        setResults(newResults);

        if (currentCard < deck.flashcardSet.length - 1) {
            setCurrentCard(currentCard + 1);
        } else {
            setShowResult(true);
        }
    };

    if (cards.length === 0) {
        return (
            <>
                <Typography variant="h6" color="secondary">
                    Sorry, no cards in this deck yet. :(
                </Typography>
                <Typography variant="h6">
                    Maybe try <Link to="/my-decks">another deck</Link>?
                </Typography>
            </>
        );
    }

    return (
        <div>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h5" gutterBottom>{deck.name} ({cards.length} cards)</Typography>
                <Typography variant="h6" gutterBottom color="primary">{currentCard + 1}/{cards.length}</Typography>
            </Box>
            <Flashcard card={cards[currentCard]} onDone={handleDone} key={currentCard} />
            <GraphQlError error={error} context="Failed to fetch deck from server" />
        </div>
    );
}

export default Challenge;