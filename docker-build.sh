#!/bin/bash

source ./.env.sh

echo "Building $DOCKER_TAG..."

$DOCKER build . \
  --build-arg RADARR_APIKEY=$RADARR_APIKEY \
  --build-arg RADARR_ENDPOINT=$RADARR_ENDPOINT \
  --build-arg SONARR_APIKEY=$SONARR_APIKEY \
  --build-arg SONARR_ENDPOINT=$SONARR_ENDPOINT \
  --rm \
  --tag $DOCKER_TAG \
;
