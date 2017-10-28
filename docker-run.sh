#!/bin/bash

source ./.env.sh

$DOCKER run \
  --name $DOCKER_NAME \
  --rm \
  $DOCKER_NAME:$DOCKER_VERSION \
;
