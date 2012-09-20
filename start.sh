#!/bin/sh
echo ******************************************-
echo * Starting 3 background servers
echo *   tatami1.js
echo *   tatami2.js
echo *   tatami3.js
echo *
echo * use fg to stop them
echo *****************************************
node tatami1.js &
node tatami2.js &
node tatami3.js &

