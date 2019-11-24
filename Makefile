lint:
	pylint --load-plugins pylint_django flashcards --disable=missing-docstring,too-few-public-methods

test:
	DEBUG=1 PG_PASS_FILE="./pg_pass" ./manage.py test

dev:
	DEBUG=1 PG_PASS_FILE="./pg_pass" ./manage.py runserver
