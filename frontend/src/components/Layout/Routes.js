import React from 'react';
import Search from "../Search";
import Login from "../user/Login";
import Signup from "../user/Signup";
import FlashcardPreview from "../FlashcardPreview";
import MyDecks from "../MyDecks";
import Deck from "../Deck";
import Challenge from "../Challenge";
import Profile from "../user/Profile";
import {Switch, Route} from "react-router-dom";
import HelpText from "../HelpText";

Routes.propTypes = {};

function Routes() {
    return (
        <Switch>
            <Route path="/" exact>
                <HelpText />
                <Search />
            </Route>
            <Route path="/search/:phrase">
                <Search />
            </Route>
            <Route path="/login">
                <Login />
            </Route>
            <Route path="/signup">
                <Signup />
            </Route>
            <Route path="/flashcard/:cardId">
                <FlashcardPreview />
            </Route>
            <Route path="/my-decks">
                <MyDecks />
            </Route>
            <Route path="/deck/:id">
                <Deck />
            </Route>
            <Route path="/challenge/:deckId?">
                <Challenge />
            </Route>
            <Route path="/profile">
                <Profile />
            </Route>
        </Switch>
    );
}

export default Routes;