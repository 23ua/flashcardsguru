import graphene
from graphene_django.types import DjangoObjectType
from graphene_django.forms.mutation import DjangoModelFormMutation
from graphql import GraphQLError
from django.db import transaction
from .. import models
from ..forms import DeckForm


class Deck(DjangoObjectType):
    class Meta:
        model = models.Deck
        filter_fields = ["name", "user", "id", "default"]


class DeckMutation(DjangoModelFormMutation):
    deck = graphene.Field(Deck)

    class Meta:
        form_class = DeckForm

    @classmethod
    def perform_mutate(cls, form, info):
        if not form.is_valid():
            raise GraphQLError("Invalid deck")

        deck = form.save(commit=False)
        deck.user = info.context.user

        if deck.default:
            with transaction.atomic():
                models.Deck.objects.filter(user=deck.user, default=True).update(default=False)
                deck.save()
        else:
            deck.save()

        return cls(errors=None, deck=deck)


class DeleteDeckMutationInput(graphene.InputObjectType):
    id = graphene.ID(required=True)


class DeleteDeckMutation(graphene.Mutation):
    class Arguments:
        input = DeleteDeckMutationInput(required=True)

    deck = graphene.Field(Deck)

    @classmethod
    def mutate(cls, _, info, input):
        deck = models.Deck.objects.get(id=input.id, user=info.context.user)

        if deck.default:
            raise Exception("Unable to delete default deck")

        deck.delete()
        # id field was automatically removed by Django on deletion
        deck.id = input.id

        return cls(deck=deck)
