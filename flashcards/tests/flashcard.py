import json
from unittest import TestCase
from .utils import GraphQLTestCase
from .. import dictionary

FLASHCARD_MUTATION = """
    mutation Flashcard($input: FlashcardMutationInput!) {
        flashcard(input: $input) {
            errors {
                field
                messages
            }
        }
    }
"""


class DictionaryCase(TestCase):
    def test_autocomplete(self):
        suggestions = dictionary.autocomplete('kangaroo cour')
        self.assertEqual(suggestions, ["kangaroo court"])

    def test_lookup(self):
        meanings = dictionary.lookup("kangaroo court")
        self.assertIsInstance(meanings[0]['definition'], str)

    def test_lookup_meaning(self):
        phrase = "kangaroo court"
        meanings = dictionary.lookup(phrase)
        meaning_id = meanings[0]['id']
        meaning = dictionary.lookup_meaning(phrase, meaning_id)
        self.assertEqual(meanings[0], meaning)


class AddFlashcardCase(GraphQLTestCase):
    def setUp(self) -> None:
        phrase = "kangaroo court"
        meanings = dictionary.lookup(phrase)
        meaning_id = meanings[0]['id']
        self.phrase = phrase
        self.meaning_id = meaning_id

    def test_add(self):
        response = self.query(
            FLASHCARD_MUTATION,
            variables={"input": {
                "phrase": self.phrase,
                "meaningId": self.meaning_id,
                "autoAdd": False,
            }}
        )

        content = json.loads(response.content)
        self.assertIsNone(content['data']['flashcard']['errors'])


class AutoAddFlashcardCase(GraphQLTestCase):
    def setUp(self) -> None:
        phrase = "raffle"
        meanings = dictionary.lookup(phrase)
        self.phrase = phrase
        self.meaning_ids = [meanings[0]['id'], meanings[1]['id']]

    def test_auto_add(self):
        response = self.query(
            FLASHCARD_MUTATION,
            variables={"input": {
                "phrase": self.phrase,
                "meaningId": self.meaning_ids[0],
                "autoAdd": True,
            }}
        )

        content = json.loads(response.content)
        self.assertIsNone(content['data']['flashcard']['errors'])

        response = self.query(
            FLASHCARD_MUTATION,
            variables={"input": {
                "phrase": self.phrase,
                "meaningId": self.meaning_ids[1],
                "autoAdd": True,
            }}
        )

        content = json.loads(response.content)
        # unable to auto add flashcard that already exists
        self.assertEqual(content['errors'][0]['message'], "Flashcard already exists")

        response = self.query(
            FLASHCARD_MUTATION,
            variables={"input": {
                "phrase": self.phrase,
                "meaningId": self.meaning_ids[1],
                "autoAdd": False,
            }}
        )

        # changing meaning explicitly works
        content = json.loads(response.content)
        self.assertIsNone(content['data']['flashcard']['errors'])
