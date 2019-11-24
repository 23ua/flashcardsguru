from graphene_django.types import DjangoObjectType
from django.contrib.auth import models
from django.contrib.auth import authenticate, login, logout
from graphql import GraphQLError
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.core.validators import EmailValidator
import graphene


class User(DjangoObjectType):
    temporary = graphene.Boolean()

    class Meta:
        model = models.User
        fields = ("username", "email", "last_login", "date_joined")

    @staticmethod
    def resolve_temporary(user, _):
        return not user.has_usable_password()


class AuthenticationMutation(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)

    username = graphene.String(required=True)

    @staticmethod
    def mutate(_cls, info, username, password):
        user = authenticate(info.context, username=username, password=password)
        if user is not None:
            login(info.context, user)
            return AuthenticationMutation(username=username)

        raise GraphQLError('Invalid credentials')


class SignOutMutation(graphene.Mutation):
    username = graphene.String(required=True)

    @staticmethod
    def mutate(_cls, info):
        username = info.context.user.username
        logout(info.context)

        return SignOutMutation(username=username)


class SignupMutation(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    username = graphene.String(required=True)
    email = graphene.String(required=True)

    @staticmethod
    def mutate(_cls, info, username, email, password):
        try:
            validate_password(password)
        except ValidationError as errors:
            raise GraphQLError(" ".join(errors))

        email_validator = EmailValidator()
        try:
            email_validator(email)
        except ValidationError as errors:
            raise GraphQLError(" ".join(errors))

        user = info.context.user
        user.username = username
        user.email = email
        user.set_password(password)

        try:
            user.save()
        except IntegrityError as error:
            if "UNIQUE" in error.args[0] and "auth_user.username" in error.args[0]:
                raise GraphQLError("Invalid username. Please choose another.")

            raise GraphQLError("Failed to create user")

        login(info.context, user)

        return SignupMutation(username=user.username, email=user.email)
