FROM node:10-slim

RUN apt-get update && \
    apt-get install --no-install-recommends -y \
        jq

LABEL version="1.0.0"
LABEL repository="https://github.com/helaili/github-graphql-action"
LABEL homepage="https://github.com/helaili/github-graphql-action"
LABEL maintainer="Alain Hélaïli <helaili@github.com>"

ADD package.json /package.json
ADD package-lock.json /package-lock.json
WORKDIR /

RUN npm ci

COPY . /

ENTRYPOINT ["node", "/entrypoint.js"]
