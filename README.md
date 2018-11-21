ijf.io
======

Prototype node code to parse the UDP packets sent by the IJF scoreboard.

npm install will install required modules.

You will then need to make a copy of config.js.default and save as config.js
Edit this file and add your credentials for twitter, etc.

Depending on your setup the code will tweet the result of a contest when
it concludes. It will optionally make announcement via Growl (OSX) or
store the result in a CouchDB database.

Start with: node tatami1.js (or tatami2.js etc)

