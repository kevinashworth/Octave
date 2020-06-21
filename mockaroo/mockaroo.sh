#!/bin/sh

mkdir generated
node get-from-schema --schema=contacts
node upload-contacts-csv
node get-from-schema -s offices
node upload-offices-csv
node get-from-schema --schema=pastprojects
node get-from-schema --schema=projects

mv generated ../packages/v8/lib/server/seeds
