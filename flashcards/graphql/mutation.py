import graphene
from .auth import AuthenticationMutation, SignOutMutation, SignupMutation
from .deck import DeleteDeckMutation, DeckMutation
from .flashcard import FlashcardMutation, DeleteFlashcardMutation


class Mutation(graphene.ObjectType):
    authenticate = AuthenticationMutation.Field()
    signup = SignupMutation.Field()
    sign_out = SignOutMutation.Field()
    deck = DeckMutation.Field()
    delete_deck = DeleteDeckMutation.Field()
    flashcard = FlashcardMutation.Field()
    delete_flashcard = DeleteFlashcardMutation.Field()
