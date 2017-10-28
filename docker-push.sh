#!/bin/bash

source .env.sh

$DOCKER tag $DOCKER_TAG $DOCKER_REPO:latest
$DOCKER image push $DOCKER_TAG
$DOCKER image push $DOCKER_REPO:latest
