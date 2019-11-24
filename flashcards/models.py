from django.db import models
from django.db.models import Q
from django.contrib.auth.models import User


class Deck(models.Model):
    """A collection of Flashcards"""
    name = models.CharField(max_length=200)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    default = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        constraints = [
            # Only one default deck per user
            models.UniqueConstraint(
                fields=['user', 'default'],
                name="deck_default_per_user_uniq",
                condition=Q(default=True)
            ),
            # deck names should be unique per user
            models.UniqueConstraint(
                fields=['user', 'name'],
                name="deck_name_per_user_uniq",
            )
        ]


class Flashcard(models.Model):
    """A single flashcard of a particular user"""
    phrase = models.CharField(max_length=200)
    # e.g. synset.name from wordnet
    meaning_id = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    deck = models.ForeignKey(Deck, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.phrase

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['deck', 'phrase'], name="phrase_in_deck_uniq")
        ]
