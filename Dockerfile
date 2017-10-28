FROM node:6-alpine
LABEL AUTHOR "support@nativecode.com"

ARG APPCMD=scheduler
ARG APPDIR=/app

ARG RADARR_APIKEY=
ARG RADARR_ENDPOINT="http://localhot:7878/api"
ARG SONARR_APIKEY=
ARG SONARR_ENDPOINT="http://localhot:8989/api"

ENV APPCMD=${APPCMD}
ENV APPDIR=${APPDIR}

ENV RADARR_APIKEY=${RADARR_APIKEY}
ENV RADARR_ENDPOINT=${RADARR_ENDPOINT}
ENV SONARR_APIKEY=${SONARR_APIKEY}
ENV SONARR_ENDPOINT=${SONARR_ENDPOINT}

WORKDIR ${APPDIR}

COPY dist .
COPY package.json .
COPY yarn.lock .
COPY nas-config.json .
COPY nas-schedule.json .

RUN set -ex \
  # setup
  && touch ~/.profile \
  # upgrade and install packages
  && apk update \
  && apk upgrade \
  && apk add ca-certificates curl wget \
  && update-ca-certificates \
  # download and install yarn
  && wget https://yarnpkg.com/install.sh \
  && chmod +x ./install.sh \
  && ./install.sh \
  && rm ./install.sh \
  # install packages
  && yarn install --pure-lockfile \
  # finalize
  && mkdir -p ${APPDIR}/config \
  && export PATH="$HOME/.yarn/bin:$PATH" \
  ;

COPY nas-config.json config/
COPY nas-schedule.json config/
VOLUME ${APPDIR}/config

CMD [ "yarn", "dist-scheduler" ]