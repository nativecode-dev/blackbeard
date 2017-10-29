FROM node:6-alpine
LABEL AUTHOR "support@nativecode.com"

ARG APPCMD="scheduler"
ARG APPDIR=/app

# Configuration args
ARG RADARR_APIKEY=
ARG RADARR_ENDPOINT="http://localhot:7878/api"
ARG SONARR_APIKEY=
ARG SONARR_ENDPOINT="http://localhot:8989/api"
ARG XSPEEDS_APIKEY=
# Map args to environment
ENV RADARR_APIKEY=${RADARR_APIKEY}
ENV RADARR_ENDPOINT=${RADARR_ENDPOINT}
ENV SONARR_APIKEY=${SONARR_APIKEY}
ENV SONARR_ENDPOINT=${SONARR_ENDPOINT}
ENV XSPEEDS_APIKEY=${XSPEEDS_APIKEY}
# Producton environment variavles
ENV APPCMD=${APPCMD}
ENV APPDIR=${APPDIR}
ENV DEBUG="nativecode:*"
ENV NODE_ENV=production

WORKDIR ${APPDIR}

COPY .env.version VERSION
COPY dist ${APPDIR}/
COPY docker-startup.sh ${APPDIR}/
COPY nas-*.json ${APPDIR}/
COPY package.json ${APPDIR}/
COPY yarn.lock ${APPDIR}/

RUN set -ex \
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
  ;

VOLUME ${APPDIR}/config

CMD [ "./docker-startup.sh" ]
