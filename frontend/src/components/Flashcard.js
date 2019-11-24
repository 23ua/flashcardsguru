import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Box, Button, Card, CardActions, CardContent, LinearProgress, Typography} from "@material-ui/core";
import WordClass from "./WordClass";
import Answer from "./Answer";
import TimerProgress from "./TimerProgress";

Flashcard.propTypes = {
    card: PropTypes.shape({
        phrase: PropTypes.string.isRequired,
        meaning: PropTypes.shape({
            wordClass: PropTypes.string.isRequired,
            definition: PropTypes.string.isRequired,
            examples: PropTypes.arrayOf(PropTypes.string).isRequired,
        }).isRequired,
    }).isRequired,
    onDone: PropTypes.func,
    preview: PropTypes.bool,
};


Flashcard.defaultValues = {
    preview: false,
};


function Flashcard({ card, onDone }) {
    const { wordClass, definition, examples } = card.meaning;
    const [finished, setFinished] = useState(false);
    const handleDone = guessed => () => onDone(guessed);

    return (
        <Card>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography color="textSecondary" paragraph={false} component="span">
                        {card.phrase}
                    </Typography>
                    <Button
                        color="primary"
                        size="small"
                        onClick={ handleDone(null) }
                        disabled={finished}
                    >
                        Skip
                    </Button>
                </Box>
                <WordClass code={wordClass}/>
                <Box style={{ opacity: finished ? 1 : 0 }}>
                    <Answer definition={definition} examples={examples} phrase={card.phrase} />
                </Box>
                {!finished &&
                    <>
                        <Typography>Do you remember this word?</Typography>
                        <TimerProgress milliseconds={5000} onFinish={() => setFinished(true)} />
                    </>
                }
                {/* compensate for progressbar and text after time ends */}
                {finished && <Box height="28px" />}
            </CardContent>
            <CardActions style={{ justifyContent: 'flex-end' }}>
                {finished &&
                    <>
                        <Button
                            size="small"
                            color="primary"
                            onClick={ handleDone(true) }
                        >
                            Guessed
                        </Button>
                        <Button
                            size="small"
                            color="secondary"
                            onClick={ handleDone(false) }
                            >
                            Not guessed
                        </Button>
                    </>
                }
                {!finished &&
                    <Button
                        size="small"
                        onClick={ () => setFinished(true) }
                    >
                        Show answer
                    </Button>
                }
            </CardActions>
        </Card>
    );
}

export default Flashcard;