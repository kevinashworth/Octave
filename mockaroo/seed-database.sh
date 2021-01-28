# Script to get new Mockaroo data into a packages/octave/lib/server/seeds/generated folder
# and then modify settings.json to use that data on next start

#!/bin/sh

if [ ! -d ./packages/octave/lib/server/seeds/generated ]; then
  cd mockaroo
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

  node post-seed-database
else
  echo "Please remove packages/octave/lib/server/seeds/generated to generate Mockaroo seed data"
fi
