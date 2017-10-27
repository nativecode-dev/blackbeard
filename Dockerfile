FROM node:6-alpine
LABEL AUTHOR "support@nativecode.com"

ARG APPDIR=/app

ARG RADARR_APIKEY=
ARG RADARR_ENDPOINT="http://localhot:7878/api"

ARG SONARR_APIKEY=
ARG SONARR_ENDPOINT="http://localhot:8989/api"

WORKDIR ${APPDIR}

COPY dist .
COPY package.json .

RUN set -ex \
  && npm install --production \
  && ls -lah \
  ;

VOLUME ${APPDIR}

CMD [ "npm", "start" ]
