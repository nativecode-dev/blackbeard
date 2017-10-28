#!/bin/bash

source ./.env.sh

$DOCKER run \
  --name $DOCKER_NAME \
  --rm \
  $DOCKER_TAG \
;
