#!/bin/bash

clear

YARN=`which yarn`

if [ ! -d "./node_modules" ]; then
  echo "Installing Packages..."
  $YARN install
else
  echo "Skipping Package Installation"
fi

echo "Building..."
$YARN build
