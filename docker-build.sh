#!/bin/bash

source ./.env.sh

echo "Building $DOCKER_TAG..."

$DOCKER build \
  --build-arg APPCMD=$APPCMD \
  --build-arg RADARR_APIKEY=$RADARR_APIKEY \
  --build-arg RADARR_ENDPOINT=$RADARR_ENDPOINT \
  --build-arg SONARR_APIKEY=$SONARR_APIKEY \
  --build-arg SONARR_ENDPOINT=$SONARR_ENDPOINT \
  --build-arg XSPEEDS_APIKEY=$XSPEEDS_APIKEY \
  --rm \
  --tag $DOCKER_TAG \
  . \
;

$DOCKER build \
  --build-arg APPCMD=ircwatch \
  --build-arg RADARR_APIKEY=$RADARR_APIKEY \
  --build-arg RADARR_ENDPOINT=$RADARR_ENDPOINT \
  --build-arg SONARR_APIKEY=$SONARR_APIKEY \
  --build-arg SONARR_ENDPOINT=$SONARR_ENDPOINT \
  --build-arg XSPEEDS_APIKEY=$XSPEEDS_APIKEY \
  --rm \
  --tag $DOCKER_REPO-ircwatch:$DOCKER_VERSION \
  . \
;

$DOCKER build \
  --build-arg APPCMD=scheduler \
  --build-arg RADARR_APIKEY=$RADARR_APIKEY \
  --build-arg RADARR_ENDPOINT=$RADARR_ENDPOINT \
  --build-arg SONARR_APIKEY=$SONARR_APIKEY \
  --build-arg SONARR_ENDPOINT=$SONARR_ENDPOINT \
  --build-arg XSPEEDS_APIKEY=$XSPEEDS_APIKEY \
  --rm \
  --tag $DOCKER_REPO-scheduler:$DOCKER_VERSION \
  . \
;
