#!/bin/bash

DOCKER=`which docker`

$DOCKER ps -aq --no-trunc | xargs docker rm
$DOCKER images -q --filter dangling=true | xargs docker rmi
