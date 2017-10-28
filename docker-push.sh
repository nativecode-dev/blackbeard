#!/bin/bash

source ./.env.sh

$DOCKER image push $DOCKER_TAG
