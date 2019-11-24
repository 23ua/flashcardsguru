import React from 'react';
import PropTypes from 'prop-types';
import {Box, Table, TableBody, TableHead, TableRow, TableCell, Typography, Button} from "@material-ui/core";
import { useHistory } from "react-router-dom";

ChallengeResults.propTypes = {
    deck: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
    cards: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        phrase: PropTypes.string.isRequired,
    })).isRequired,
    results: PropTypes.object.isRequired,
};

function resultToText(result) {
    if (result === true) {
        return "Correct";
    } else if (result === false) {
        return "Incorrect";
    }

    return "Skipped";
}

function ChallengeResults({ deck, cards, results }) {
    let numberOfGuessed = 0;
    let numberOfSkipped = 0;
    for (const guessed of Object.values(results)) {
        if (guessed) {
            numberOfGuessed++;
        }

        if (guessed === null) {
            numberOfSkipped++;
        }
    }

    let history = useHistory();

    return (
        <div>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h5" gutterBottom>{deck.name}</Typography>
                <Typography variant="h6" gutterBottom color="primary">
                    {numberOfGuessed}/{cards.length} correct ({numberOfSkipped} skipped)
                </Typography>
            </Box>
            <Button color="primary" onClick={() => window.location.reload()}>
                Try Again? 😉
            </Button>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Word</TableCell>
                        <TableCell>Result</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {cards.map(card => {
                        const result = results[card.id];

                        return (
                            <TableRow
                                hover
                                key={card.id}
                                onClick={() => history.push(`/flashcard/${card.id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <TableCell>{card.phrase}</TableCell>
                                <TableCell>{resultToText(result)}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}

export default ChallengeResults;