#!/bin/bash

if [ -f ./.env.version ]; then
  DOCKER_VERSION=`cat .env.version`
else
  DOCKER_VERSION="latest"
fi

DOCKER=`which docker`
DOCKER_NAME="blackbeard"
DOCKER_REPO="mikepham/$DOCKER_NAME"
DOCKER_TAG="$DOCKER_REPO:$DOCKER_VERSION"
