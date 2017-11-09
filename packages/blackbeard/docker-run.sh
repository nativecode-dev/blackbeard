#!/bin/bash

source .env.sh

if [ $1 ]; then
  APPCMD=$1
fi

$DOCKER run \
  --name $DOCKER_NAME \
  -e APPCMD=$APPCMD \
  --rm \
  $DOCKER_TAG \
;
