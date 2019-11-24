import React from 'react';
import PropTypes from 'prop-types';
import {Typography} from "@material-ui/core";

Answer.propTypes = {
    definition: PropTypes.string.isRequired,
    examples: PropTypes.arrayOf(PropTypes.string).isRequired,
    phrase: PropTypes.string.isRequired,
};

function Answer({ examples, definition, phrase }) {
    const examplesWithPhrase = examples.filter(example => {
        // TODO: What about words/languages with diacritics etc?
        const lowercaseExample = example.toLowerCase();
        const lowercasePhrase = phrase.toLowerCase();
        return lowercaseExample.includes(lowercasePhrase);
    });
    const definitionText = examplesWithPhrase.length > 0 ? `${definition}:` : definition;

    return (
        <>
            <Typography variant="subtitle2">{definitionText}</Typography>
            {examplesWithPhrase.map(example => (
                <Typography variant="caption" component="p" key={example}>- {example}</Typography>
            ))}
        </>
    );
}

export default Answer;