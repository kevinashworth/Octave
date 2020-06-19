#!/bin/sh

node 1contacts.js
node 1upload.js
node 2offices.js
node 2upload.js
node 3projects.js
node 4pastprojects.js
node 5statistics.js

npx csvtojson generated/contacts.csv > converted/contacts.json
npx csvtojson generated/offices.csv > converted/offices.json
npx csvtojson generated/pastprojects.csv > converted/pastprojects.json
npx csvtojson generated/projects.csv > converted/projects.json
npx csvtojson generated/statistics.csv > converted/statistics.json

cp converted/*.json ../packages/v8/lib/server/seeds
