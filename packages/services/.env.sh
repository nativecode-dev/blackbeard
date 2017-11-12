#!/bin/bash

# Get the current branch.
export BRANCH=`git rev-parse --abbrev-ref HEAD`

# Check the version first, so we get the existing
# one before anything else runs.
if [ -f ./.env.version ]; then
  export DOCKER_VERSION=`cat .env.version`
else
  export DOCKER_VERSION="latest"
fi

# Increment the version if the DOCKER_PUSH env
# is set to yes and we're on master.
if [[ $DOCKER_PUSH = "yes" && $BRANCH = "master" ]]; then
  DOCKER_VERSION=`echo $(expr $DOCKER_VERSION + 1)`
  echo $DOCKER_VERSION > .env.version
fi

# Export all the variables.
export DOCKER=`which docker`
export DOCKER_RUN="${DOCKER_RUN:-false}"

export DOCKER_NAME="blackbeard"
export DOCKER_REPO="nativecode/$DOCKER_NAME"
export DOCKER_TAG="$DOCKER_REPO:$DOCKER_VERSION"
