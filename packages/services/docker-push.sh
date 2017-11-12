#!/bin/bash

set -e

. .env.sh

TRAVIS_BRANCH=${TRAVIS_BRANCH:-$BRANCH}

if [ $BRANCH = "master" ] || [ $TRAVIS_BRANCH = "master" ]; then

  # Create docker images first.
  yarn run docker

  # LATEST
  $DOCKER tag $DOCKER_TAG $DOCKER_REPO:latest
  $DOCKER image push $DOCKER_TAG
  $DOCKER image push $DOCKER_REPO:latest

  # IRCWATCH
  $DOCKER tag $DOCKER_REPO-ircwatch:$DOCKER_VERSION $DOCKER_REPO-ircwatch:latest
  $DOCKER image push $DOCKER_REPO-ircwatch:$DOCKER_VERSION
  $DOCKER image push $DOCKER_REPO-ircwatch:latest

  # SCHEDULER
  $DOCKER tag $DOCKER_REPO-scheduler:$DOCKER_VERSION $DOCKER_REPO-scheduler:latest
  $DOCKER image push $DOCKER_REPO-scheduler:$DOCKER_VERSION
  $DOCKER image push $DOCKER_REPO-scheduler:latest

else

  echo "Current branch ($BRANCH/$TRAVIS_BRANCH) is not master. Refusing to push docker images."

fi
