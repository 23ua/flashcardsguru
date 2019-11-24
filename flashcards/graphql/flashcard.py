import graphene
from graphene import ObjectType
from graphene_django.types import DjangoObjectType
from graphene_django.forms.mutation import DjangoModelFormMutation
from graphql import GraphQLError
from .. import models
from ..forms import FlashcardForm
from .. import dictionary
from .deck import Deck


class Meaning(ObjectType):
    id = graphene.String(required=True)
    definition = graphene.String(required=True)
    examples = graphene.List(graphene.String, required=True)
    word_class = graphene.Field(graphene.Enum.from_enum(dictionary.WordClass), required=True)


class Flashcard(DjangoObjectType):
    meaning = graphene.Field(Meaning, required=True)
    deck = graphene.Field(Deck, required=True)

    class Meta:
        model = models.Flashcard
        filter_fields = ["phrase", "meaning_id", "user", "deck", "id"]

    @staticmethod
    def resolve_meaning(root, _info):
        return dictionary.lookup_meaning(root.phrase, root.meaning_id)


class Phrase(ObjectType):
    phrase = graphene.String()
    meanings = graphene.List(Meaning)
    saved_meaning_id = graphene.String()


class FlashcardMutation(DjangoModelFormMutation):
    class Meta:
        form_class = FlashcardForm

    @classmethod
    def perform_mutate(cls, form, info):
        if not form.is_valid():
            raise GraphQLError("Invalid flashcard")

        phrase = form.cleaned_data['phrase']
        if form.cleaned_data['auto_add']:
            existing_flashcard = models.Flashcard.objects.filter(
                phrase=phrase,
                user=info.context.user
            )
            if existing_flashcard.exists():
                # flashcard was already added
                raise Exception('Flashcard already exists')

        if form.cleaned_data['deck']:
            deck = form.cleaned_data['deck']
        else:
            deck = models.Deck.objects.get(user=info.context.user, default=True)

        flashcard, _ = models.Flashcard.objects.update_or_create(
            defaults={'meaning_id': form.cleaned_data['meaning_id']},
            phrase=phrase,
            user=info.context.user,
            deck=deck,
        )

        return cls(errors=None, flashcard=flashcard)


class DeleteFlashcardMutationInput(graphene.InputObjectType):
    phrase = graphene.String(required=True)
    meaning_id = graphene.String(required=True)
    deck = graphene.Int(required=False)


class DeleteFlashcardMutation(graphene.Mutation):
    flashcard = graphene.Field(Flashcard, required=True)

    class Arguments:
        input = DeleteFlashcardMutationInput(required=True)

    @staticmethod
    def mutate(_cls, info, input):
        if input.deck:
            deck = input.deck
        else:
            deck = models.Deck.objects.get(user=info.context.user, default=True)

        flashcard = models.Flashcard.objects.get(
            deck=deck,
            phrase=input.phrase,
            meaning_id=input.meaning_id
        )
        flashcard.delete()

        return DeleteFlashcardMutation(flashcard=flashcard)
