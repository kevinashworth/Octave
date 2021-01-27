#!/bin/sh

# See https://docs.github.com/en/actions/reference/encrypted-secrets#limits-for-secrets

# Decrypt the file
mkdir $HOME/secrets
# --batch to prevent interactive command
# --yes to assume "yes" for questions
gpg --quiet --batch --yes --decrypt --passphrase="$SETTINGS_JSON_PASSPHRASE" \
--output $HOME/secrets/settings.json settings.json.gpg
