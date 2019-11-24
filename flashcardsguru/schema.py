import graphene
from flashcards.graphql import query, mutation


class Query(query.Query, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=mutation.Mutation)
