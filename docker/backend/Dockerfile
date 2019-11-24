FROM python:3.7-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache postgresql-client gcc musl-dev postgresql-dev

RUN python3 -m venv venv
ENV PATH="venv/bin:$PATH"

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt


FROM python:3.7-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache postgresql-client binutils libc-dev libpq
ENV PATH="venv/bin:$PATH"

COPY . .
COPY --from=0 /usr/src/app/venv venv

RUN python -c "import nltk; nltk.download('wordnet')"

CMD ["./docker/backend/start.sh"]