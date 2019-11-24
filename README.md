# flashcardsguru
Flashcards Guru allows you to look up words in a dictionary and automatically saves them to a deck of flashcards.

You can learn the words you've added afterwards.

## Usage
`flashcardsguru` can be deployed with docker compose:


1. Clone the repo
```
$ git clone https://github.com/23ua/flashcardsguru
```
2. Go to flashcardsguru folder
```
$ cd flashcardsguru
```

3. Generate secret key (with `pwgen` or any other way)
```
$ pwgen 128 1 > secret_key
```

4. Generate postgres password
```
$ pwgen 80 1 > pg_pass
```

5. Add the following environment variables to your environment or `.env` file:
```
TZ=Pacific/Auckland
LETSENCRYPT=true
LE_EMAIL=email@exmple.com
LE_FQDN=example.com
```
You can set `LETSENCRYPT` to false if you don't need to generete certificates.
For more info about certificates see https://github.com/umputun/nginx-le

6. Create and start containers:
```
$ docker-compose up -d
```

## Tech stack
- Python
- Django
- Graphql (graphene)
- React
- Docker for deployment
