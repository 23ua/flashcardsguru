from django import forms
from django.forms import ModelForm
from .models import Deck, Flashcard


class DeckForm(ModelForm):
    default = forms.BooleanField(required=False)

    class Meta:
        model = Deck
        fields = ['id', 'name', 'default']


class FlashcardForm(ModelForm):
    deck = forms.IntegerField(required=False)
    auto_add = forms.BooleanField(required=False)

    class Meta:
        model = Flashcard
        fields = ['id', 'phrase', 'meaning_id', 'deck']
