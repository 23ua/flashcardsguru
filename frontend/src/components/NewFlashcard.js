import React from 'react';
import PropTypes from 'prop-types';
import {CardContent, Card, Divider} from "@material-ui/core";
import NewFlashcardMeaning from "./NewFlashcardMeaning";

NewFlashcard.propTypes = {
    autoSave: PropTypes.bool,
    card: PropTypes.shape({
        phrase: PropTypes.string.isRequired,
        meanings: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                wordClass: PropTypes.string.isRequired,
                definition: PropTypes.string.isRequired,
                examples: PropTypes.arrayOf(PropTypes.string).isRequired,
            })
        ).isRequired,
        savedMeaningId: PropTypes.string,
    }).isRequired,
};

NewFlashcard.defaultValues = {
    autoSave: false,
};


function NewFlashcard({ card }) {
    let savedMeaningId = card.savedMeaningId;

    return (
        <Card>
            <CardContent>
                {card.meanings.map(({ wordClass, definition, examples, id }, i) => (
                    <React.Fragment key={id}>
                        {i !== 0 &&
                            <Divider variant="middle" style={ {marginBottom: 15, marginTop: 15} }/>
                        }
                        <NewFlashcardMeaning
                            phrase={card.phrase}
                            wordClass={wordClass}
                            definition={definition}
                            examples={examples}
                            saved={savedMeaningId === id}
                            meaningId={id}
                            autoSave={!card.savedMeaningId && i === 0}
                        />
                    </React.Fragment>
                ))}
            </CardContent>
        </Card>
    );
}

export default NewFlashcard;