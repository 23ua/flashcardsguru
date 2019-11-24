from graphene import ObjectType
import graphene
from .. import models
from .. import dictionary
from .deck import Deck
from .flashcard import Flashcard, Phrase
from .auth import User


class Query(ObjectType):
    my_decks = graphene.List(Deck)
    deck = graphene.Field(Deck, id=graphene.ID(), default=graphene.Boolean())

    flashcard = graphene.Field(Flashcard, id=graphene.ID())

    autocomplete_words = graphene.List(graphene.String, prefix=graphene.String())

    user = graphene.Field(User)

    phrase_preview = graphene.Field(Phrase, phrase=graphene.String())

    @staticmethod
    def resolve_my_decks(_cls, info):
        return models.Deck.objects.filter(user=info.context.user)

    @staticmethod
    def resolve_flashcard(_cls, info, **kwargs):
        id = kwargs.get('id')
        return models.Flashcard.objects.get(pk=id, user=info.context.user)

    @staticmethod
    def resolve_deck(_cls, info, **kwargs):
        return models.Deck.objects.get(user=info.context.user, **kwargs)

    @staticmethod
    def resolve_user(_cls, info):
        if info.context.user.is_authenticated:
            return info.context.user

        return None

    @staticmethod
    def resolve_autocomplete_words(_cls, _info, prefix):
        return dictionary.autocomplete(prefix)

    @staticmethod
    def resolve_phrase_preview(_cls, info, phrase):
        meanings = dictionary.lookup(phrase)

        saved_meaning_id = None
        user = info.context.user
        if user.is_authenticated:
            default_deck = models.Deck.objects.get(user=user, default=True)
            saved_card = models.Flashcard.objects.filter(
                phrase=phrase,
                user=user,
                deck=default_deck
            )
            if saved_card.exists():
                saved_meaning_id = saved_card[0].meaning_id

        return {
            'phrase': phrase,
            'meanings': meanings,
            'saved_meaning_id': saved_meaning_id
        }
