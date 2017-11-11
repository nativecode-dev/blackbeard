#!/bin/bash

source .env.sh

if [ $BRANCH = "master" ]; then
  $DOCKER tag $DOCKER_TAG $DOCKER_REPO:latest
  $DOCKER image push $DOCKER_TAG
  $DOCKER image push $DOCKER_REPO:latest

  $DOCKER tag $DOCKER_REPO-ircwatch:$DOCKER_VERSION $DOCKER_REPO-ircwatch:latest
  $DOCKER image push $DOCKER_REPO-ircwatch:$DOCKER_VERSION
  $DOCKER image push $DOCKER_REPO-ircwatch:latest

  $DOCKER tag $DOCKER_REPO-scheduler:$DOCKER_VERSION $DOCKER_REPO-scheduler:latest
  $DOCKER image push $DOCKER_REPO-scheduler:$DOCKER_VERSION
  $DOCKER image push $DOCKER_REPO-scheduler:latest
else
  echo "Current branch is not master. Refusing to push docker images."
fi