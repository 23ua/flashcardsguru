import json
from django.contrib.sessions.models import Session
from django.contrib.auth.models import User
from .utils import GraphQLTestCase
from ..models import Deck

GET_USER_QUERY = """
    query User {
        user {
            username
            temporary
        }
    }
"""


class AutoTemporaryUserCase(GraphQLTestCase):
    def tearDown(self) -> None:
        Session.objects.all().delete()

    def test_anonymous_user_info_fetch(self):
        response = self.query(
            GET_USER_QUERY,
            op_name='User'
        )
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertTrue(content['data']['user']['temporary'])

        # Checking that default deck is automatically created for temporary users
        user = User.objects.get(username=content['data']['user']['username'])
        Deck.objects.get(user=user, default=True)


class AuthenticationCase(GraphQLTestCase):
    SIGNUP_QUERY = """
        mutation SignUp($username: String!, $email: String!, $password: String!) {
            signup(username: $username, email: $email, password: $password) {
                username
            }
        }
    """

    test_username = 'test_user'
    test_password = 'gvhvhjF^&fvyuacvys234'

    def setUp(self) -> None:
        response = self.query(
            self.SIGNUP_QUERY,
            op_name='SignUp',
            variables={
                'username': self.test_username,
                'email': 'test@example.com',
                'password': self.test_password
            }
        )
        content = json.loads(response.content)

        self.assertResponseNoErrors(response)
        self.assertEqual(self.test_username, content['data']['signup']['username'])

    def tearDown(self) -> None:
        Session.objects.all().delete()

    def test_signup(self):
        username = 'test'
        response = self.query(
            self.SIGNUP_QUERY,
            op_name='SignUp',
            variables={
                'username': username,
                'email': 'test@example.com',
                'password': 'TeSt1Ng 123'
            }
        )

        content = json.loads(response.content)

        self.assertResponseNoErrors(response)
        self.assertEqual(username, content['data']['signup']['username'])

        # Checking that default deck is automatically created for new user
        user = User.objects.get(username=username)
        Deck.objects.get(user=user, default=True)

    def test_authenticate(self):
        response = self.query(
            """
            mutation Authenticate($username: String!, $password: String!) {
                authenticate(username: $username, password: $password) {
                    username
                }
            }
            """,
            variables={'username': self.test_username, 'password': self.test_password},
            op_name='Authenticate'
        )

        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(self.test_username, content['data']['authenticate']['username'])

    def test_user_info_fetch(self):
        self.test_authenticate()

        response = self.query(
            GET_USER_QUERY,
            op_name='User'
        )
        content = json.loads(response.content)
        print(content)
        self.assertResponseNoErrors(response)
        self.assertEqual(self.test_username, content['data']['user']['username'])
        self.assertFalse(content['data']['user']['temporary'])

    def test_logout(self):
        self.test_authenticate()
        response = self.query(
            """
            mutation SignOut {
                signOut {
                    username
                }
            }
            """,
            op_name='SignOut'
        )
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(self.test_username, content['data']['signOut']['username'])
