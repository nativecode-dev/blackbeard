#!/bin/bash

# Check the version first, so we get the existing
# one before anything else runs.
if [ -f ./.env.version ]; then
  export DOCKER_VERSION=`cat .env.version`
else
  export DOCKER_VERSION="latest"
fi

# Increment the version if the DOCKER_PUSH env
# is set to yes.
if [[ $DOCKER_PUSH = "yes" ]]; then
  DOCKER_VERSION=`echo $(expr $DOCKER_VERSION + 1)`
  echo $DOCKER_VERSION > .env.version
fi

# Export all the variables.
export DOCKER=`which docker`
export DOCKER_NAME="blackbeard"
export DOCKER_REPO="mikepham/$DOCKER_NAME"
export DOCKER_TAG="$DOCKER_REPO:$DOCKER_VERSION"
