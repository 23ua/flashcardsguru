#!/bin/sh

./manage.py migrate

gunicorn --bind ":8000" --workers 4 flashcardsguru.wsgi:application