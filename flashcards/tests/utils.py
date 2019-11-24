from graphene_django.utils import testing
from flashcardsguru.schema import schema


class GraphQLTestCase(testing.GraphQLTestCase):
    GRAPHQL_SCHEMA = schema
    GRAPHQL_URL = "/graphql"
