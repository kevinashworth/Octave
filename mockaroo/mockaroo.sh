#!/bin/sh
set -e

if [ ! -d ../packages/v8/lib/server/seeds/generated ]; then
  mkdir generated
  node get-from-schema --schema=contacts
  node upload-contacts-csv
  node get-from-schema -s offices
  node upload-offices-csv
  node get-from-schema --schema=pastprojects
  node get-from-schema --schema=projects

  mv generated ../packages/v8/lib/server/seeds
else
  echo "Please remove packages/v8/lib/server/seeds/generated to generate Mockaroo seed data"
fi
