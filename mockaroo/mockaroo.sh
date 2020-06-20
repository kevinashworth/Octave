#!/bin/sh

node 1-get-contacts-json.js
node 1-upload-contacts-csv.js
node 2-get-offices-json.js
node 2-upload-offices-csv.js
node 3-get-projects-json.js
node 4-get-pastprojects-json.js

cp generated/*.json ../packages/v8/lib/server/seeds
