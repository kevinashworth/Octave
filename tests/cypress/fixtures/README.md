# Triad

Triad is our testing database. These are commands to update localhost with the latest version:

- Get a compressed archive from MongoDB Atlas:\
`mongodump --uri mongodb+srv://triad-read-only:d0wnl0adTr1ad@cluster0.dk7n0.mongodb.net --archive=./tests/cypress/fixtures/Triad.gz --gzip --db=Triad`

- Restore the compressed archive (while running Octave locally):\
`mongorestore --host localhost:4005 --drop --gzip --archive=./tests/cypress/fixtures/Triad.gz --nsInclude="Triad.*" --nsFrom="Triad.*" --nsTo="meteor.*"`
