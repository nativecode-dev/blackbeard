#!/bin/bash

YARN=`which yarn`

for FILE in $APPDIR/nas-*.json
do
  NAME=$(basename $FILE)
  if [ ! -f $APPDIR/config/$NAME ]; then
    cp $NAME $APPDIR/config/$NAME
  fi
done

$YARN run start $APPCMD
