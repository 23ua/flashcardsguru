import React from 'react';
import {Typography} from "@material-ui/core";
import Link from "./Link";

function HelpText() {
    return (
        <div>
            <Typography variant="body1" color="secondary" component="span">Flashcards Guru </Typography>
            <Typography variant="body2" component="span">
                allows you to look up words in a dictionary and automatically saves them to a deck of flashcards.
            </Typography>
            <Typography variant="body2">
                You can <Link to="/challenge/">Learn</Link> the words you've added afterwards.
                Try searching for a word in a text field below:
            </Typography>
        </div>
    );
}

export default HelpText;