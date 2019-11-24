import json
import uuid
from django.contrib.auth.models import User
from django.contrib.auth import login
from .models import Deck


def authentication(next, root, info, **kwargs):
    # possible optimization: use a decorator for
    # all queries and mutations that require authentication
    body = json.loads(info.context.body)
    if 'operationName' in body and body['operationName'] == 'User':
        # Disable autosignup for user profile requests
        return next(root, info, **kwargs)

    if 'query' in body and 'IntrospectionQuery' in body['query']:
        # Disable autosignup for introspection queries e.g. from graphiql
        return next(root, info, **kwargs)

    if info.context.user.is_anonymous:
        user = User.objects.create_user(str(uuid.uuid4()))
        login(info.context, user)
        Deck.objects.create(name="Default deck", user=user, default=True)

    return next(root, info, **kwargs)
