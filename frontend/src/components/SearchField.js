import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import {useLazyQuery} from "@apollo/react-hooks";
import gql from 'graphql-tag';
import GraphQlError from "./errors/GraphQlError";
import {Box, Button} from "@material-ui/core";

SearchField.propTypes = {
    onChoose: PropTypes.func,
    defaultValue: PropTypes.string,
};

export const AUTOCOMPLETE_WORDS = gql`
    query Autocomplete($prefix: String!) {
        autocompleteWords(prefix: $prefix)
    }
`;

export default function SearchField({ onChoose, defaultValue }) {
    const [autocompleteQuery, {data, loading, error}] = useLazyQuery(AUTOCOMPLETE_WORDS);
    const initialOptions = data ? data.autocompleteWords : [];
    const [options, setOptions] = useState(initialOptions);
    const [inputValue, setInputValue] = useState('');
    const [shouldSelect, setShouldSelect] = useState(false);

    if (data && data.autocompleteWords !== options) {
        setOptions(data.autocompleteWords);
    }

    const label = inputValue ? '' : 'Search';

    return (
        <Box display="flex">
            <Box flexGrow={1} mr={2}>
                <Autocomplete
                    freeSolo
                    options={options}
                    disableClearable
                    renderInput={params => {
                        const newInputValue = params.inputProps.value;
                        if (inputValue !== newInputValue) {
                            setInputValue(newInputValue);
                            autocompleteQuery({variables: {prefix: newInputValue}});

                            // These hacks are needed because Autocomplete is unstable
                            // and doesn't work properly yet.
                            // The issues are:
                            // - there's no way to handle input value change with existing API
                            //   (only *selected* values can be retrieved with Autocomplete.onChange callback)
                            // - Autocomplete.onChange callback returns 0 when one of the items
                            //   from the list is selected
                            // - after selecting a value from the list, TextField.onChange callback is not called
                            // FIXME: remove these hacks after Autocomplete stabilisation or
                            //        rewrite with another autocomplete lib
                            if (shouldSelect) {
                                // execute 'delayed' onChoose callback with correct input value
                                onChoose(newInputValue);
                                // reset shouldSelect flag
                                // FIXME: not allowed to call setState() in render!
                                setShouldSelect(false);
                            }
                        }
                        return (
                            <TextField
                                {...params}
                                margin="normal"
                                variant="outlined"
                                fullWidth
                                label={label}
                            />
                        )
                    }}
                    loading={loading}
                    onChange={e => {
                        // issue with Autocomplete: the value is set to 0 when
                        // item is selected from autocomplete list
                        if (e.target.value === 0) {
                            // in that case we set shouldSelect flag to execute onChoose callback
                            // after receiving new value when re-rendering TextField input
                            setShouldSelect(true);
                            return;
                        }
                        onChoose(e.target.value);
                    }}
                    defaultValue={defaultValue}
                />
            </Box>
            <Box display="flex" alignItems="center">
                <Button size="large" color="primary" onClick={() => onChoose(inputValue)}>
                    Search
                </Button>
            </Box>
            <GraphQlError error={error} context="Failed to fetch words for autocomplete" />
        </Box>
    );
}

