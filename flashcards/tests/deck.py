import json
from .utils import GraphQLTestCase
from ..models import Deck

DECK_MUTATION = """
    mutation Deck($input: DeckMutationInput!) {
        deck(input: $input) {
            deck {
                id
                name
                created
                default
            },
            errors {
                field
                messages
            }
        }
    }
"""


class AddDeckCase(GraphQLTestCase):
    def test_add(self):
        name = "new_deck"
        response = self.query(
            DECK_MUTATION,
            variables={"input": {"name": name, "default": False}}
        )
        content = json.loads(response.content)
        deck = content['data']['deck']['deck']
        self.assertResponseNoErrors(response)
        self.assertEqual(deck['name'], name)
        self.assertFalse(deck['default'])
        self.assertTrue(deck['id'].isdigit())
        self.assertIsNone(content['data']['deck']['errors'])

    def test_multiple_default(self):
        response1 = self.query(
            DECK_MUTATION,
            variables={"input": {"name": "first", "default": True}}
        )
        response2 = self.query(
            DECK_MUTATION,
            variables={"input": {"name": "second", "default": True}}
        )
        content1 = json.loads(response1.content)
        self.assertResponseNoErrors(response1)
        self.assertIsNone(content1['data']['deck']['errors'])

        content2 = json.loads(response2.content)
        self.assertResponseNoErrors(response2)
        self.assertIsNone(content2['data']['deck']['errors'])

        first_deck = Deck.objects.get(pk=content1['data']['deck']['deck']['id'])
        second_deck = Deck.objects.get(pk=content2['data']['deck']['deck']['id'])

        # ensure that only one default deck can exist per user
        self.assertFalse(first_deck.default)
        self.assertTrue(second_deck.default)


class DeckCase(GraphQLTestCase):
    def setUp(self) -> None:
        name = "test_deck"
        response = self.query(
            DECK_MUTATION,
            variables={"input": {"name": name, "default": False}}
        )
        content = json.loads(response.content)
        deck = content['data']['deck']['deck']
        self.deck_id = deck['id']

        response = self.query(
            DECK_MUTATION,
            variables={"input": {"name": "The default deck", "default": True}}
        )
        content = json.loads(response.content)
        deck = content['data']['deck']['deck']
        self.default_deck_id = deck['id']

    def test_get(self):
        response = self.query(
            """
                query Deck($id: ID!) {
                    deck(id: $id) {
                        id
                        name
                    }
                }
            """,
            variables={'id': self.deck_id}
        )
        content = json.loads(response.content)
        deck = content['data']['deck']
        self.assertEqual(deck['id'], self.deck_id)

    def test_get_default(self):
        response = self.query(
            """
                query DefaultDeck {
                    deck(default: true) {
                        id
                        name
                        flashcardSet {
                            id
                            phrase
                            meaning {
                                id
                                definition
                                examples
                                wordClass
                            }
                        }
                    }
                }
            """
        )
        content = json.loads(response.content)
        deck = content['data']['deck']
        self.assertEqual(deck['id'], self.default_deck_id)
        self.assertEqual(deck['flashcardSet'], [])

    def test_change(self):
        new_name = "another name"
        response = self.query(
            DECK_MUTATION,
            variables={"input": {"name": new_name, "default": True, "id": self.deck_id}}
        )
        content = json.loads(response.content)
        deck = content['data']['deck']['deck']
        self.assertEqual(deck['name'], new_name)
        self.assertTrue(deck['default'])

    def test_delete(self):
        response = self.query(
            """
            mutation DeleteDeck($input: DeleteDeckMutationInput!) {
                deleteDeck(input: $input) {
                    deck {
                        id
                    }
                }
            }
            """,
            variables={"input": {"id": self.deck_id}}
        )
        self.assertResponseNoErrors(response)
