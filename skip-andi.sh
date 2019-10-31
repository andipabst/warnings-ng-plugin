#!/bin/bash

./skip.sh

# shellcheck disable=SC2091
until $(curl --output /dev/null --silent --head --fail http://localhost:8080); do 
  printf '.'; 
  sleep 2;
done

notify-send "Jenkins is up" "warnings-ng plugin deployment finished"
