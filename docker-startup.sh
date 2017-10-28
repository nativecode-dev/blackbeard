#!/bin/bash

if [ ! -f $APPDIR/config/nas-config.json ]; then
  cp $APPDIR/nas-config.json $APPDIR/config/nas-config.json
fi

if [ ! -f $APPDIR/config/nas-schedule.json ]; then
  cp $APPDIR/nas-schedule.json $APPDIR/config/nas-schedule.json
fi

yarn dist-start
