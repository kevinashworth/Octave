#!/bin/sh

node get-from-schema --schema=contacts
node 1-upload-contacts-csv.js
node get-from-schema -s offices
node 2-upload-offices-csv.js
node get-from-schema --schema=pastprojects
node get-from-schema --schema=projects

cp -R generated ../packages/v8/lib/server/seeds
