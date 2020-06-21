#!/bin/sh

mkdir generated
node get-from-schema --schema=contacts
node 1-upload-contacts-csv
node get-from-schema -s offices
node 2-upload-offices-csv
node get-from-schema --schema=pastprojects
node get-from-schema --schema=projects

mv generated ../packages/v8/lib/server/seeds
