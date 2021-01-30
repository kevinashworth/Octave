#!/bin/sh

MONGO_URL='mongodb+srv://read-only-testing-account:valid-during-february-2021@cluster0.dk7n0.mongodb.net/Triad?retryWrites=true&w=majority' meteor --port 4004 --settings settings-public-testing.json
