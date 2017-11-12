#!/bin/bash

# Get the current branch.
export BRANCH=`git rev-parse --abbrev-ref HEAD`

export DOCKER=`which docker`
export DOCKER_RUN="${DOCKER_RUN:-false}"
export DOCKER_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')

export DOCKER_NAME="blackbeard"
export DOCKER_REPO="nativecode/$DOCKER_NAME"
export DOCKER_TAG="$DOCKER_REPO:$DOCKER_VERSION"
