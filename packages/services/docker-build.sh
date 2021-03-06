#!/bin/bash

. ./.env.sh

echo "Building $DOCKER_TAG..."

$DOCKER build \
  --build-arg APPCMD=$APPCMD \
  --rm \
  --tag $DOCKER_TAG \
  . \
;

if [ $DOCKER_RUN = "false" ]; then

  $DOCKER build \
    --build-arg APPCMD=ircwatch \
    --rm \
    --tag $DOCKER_REPO-ircwatch:$DOCKER_VERSION \
    . \
  ;

  $DOCKER build \
    --build-arg APPCMD=scheduler \
    --rm \
    --tag $DOCKER_REPO-scheduler:$DOCKER_VERSION \
    . \
  ;

fi
