FROM node:8-alpine
LABEL AUTHOR "support@nativecode.com"

ARG APPCMD="scheduler"
ARG APPDIR=/app

# Configuration args
ARG RADARR_APIKEY=
ARG RADARR_ENDPOINT="http://localhot:7878/api"
ARG REDIS=
ARG SONARR_APIKEY=
ARG SONARR_ENDPOINT="http://localhot:8989/api"
ARG XSPEEDS_APIKEY=
# Map args to environment
ENV BLACKBEARD_PATH=${APPDIR}
ENV BLACKBEARD_PATH_CONFIG=${APPDIR}/config
ENV RADARR_APIKEY=${RADARR_APIKEY}
ENV RADARR_ENDPOINT=${RADARR_ENDPOINT}
ENV REDIS=${REDIS}
ENV SONARR_APIKEY=${SONARR_APIKEY}
ENV SONARR_ENDPOINT=${SONARR_ENDPOINT}
ENV XSPEEDS_APIKEY=${XSPEEDS_APIKEY}
# Producton environment variavles
ENV APPCMD=${APPCMD}
ENV APPDIR=${APPDIR}
ENV DEBUG="nativecode:*"
ENV NODE_ENV=production

WORKDIR ${APPDIR}

# Core files
COPY .env.sh ${APPDIR}/env.sh
COPY docker-startup.sh ${APPDIR}/docker-startup.sh
COPY package.json ${APPDIR}/package.json
COPY LICENSE ${APPDIR}/LICENSE
# Bulk copy
COPY dist ${APPDIR}/
COPY nas-*.json ${APPDIR}/
COPY README-*.md ${APPDIR}/

RUN set -ex \
  && source ./env.sh \
  # setup
  && touch ~/.profile \
  # upgrade and install packages
  && apk update \
  && apk upgrade \
  && apk add bash ca-certificates curl git wget \
  && update-ca-certificates \
  # download and install yarn
  && wget https://yarnpkg.com/install.sh \
  && chmod +x ./install.sh \
  && ./install.sh \
  && rm ./install.sh \
  # install packages
  && yarn install --production=true \
  # finalize
  && mkdir -p ${APPDIR}/config \
  && chmod +x docker-startup.sh \
  && echo $DOCKER_VERSION > /app/VERSION \
  && rm ./env.sh \
  ;

VOLUME ${APPDIR}/config

CMD [ "./docker-startup.sh" ]
