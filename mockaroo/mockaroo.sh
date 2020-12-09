#!/bin/sh
set -e

if [ ! -d ../packages/octave/lib/server/seeds/generated ]; then
  mkdir generated

  node get-from-schema --schema=contacts
  node post-download --schema=contacts
  node upload-contacts-csv
  node get-from-schema --schema=offices
  node post-download --schema=offices
  node upload-offices-csv
  node get-from-schema --schema=pastprojects
  node post-download --schema=pastprojects
  node get-from-schema --schema=projects
  node post-download --schema=projects

  mv generated ../packages/octave/lib/server/seeds
else
  echo "Please remove packages/octave/lib/server/seeds/generated to generate Mockaroo seed data"
fi
