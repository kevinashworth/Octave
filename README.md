# V8

## Description
A place to collaborate and share information.

## Technologies
V8 is built with:
- Vulcan (“full-stack React+GraphQL framework,” Meteor, Apollo)
- Bootstrap, SCSS (node-sass)
- Algolia
- Storybook
- Twilio

## How to Install

### Prerequisites
You must have these tools installed first:
* Meteor
* Node
* NPM

### Installation Steps
1. Clone the [main Vulcan repo](https://github.com/VulcanJS/Vulcan).
1. Clone this repo, then `cd` into it.
1. Run `npm install`.
1. Rename `sample_settings.json` to `settings.json`.
1. As per Vulcan’s [Two-Repo Install](https://docs.vulcanjs.org/#Two-Repo-Install-Optional), launch with:
```
METEOR_PACKAGE_DIRS="/[YOUR_PATH_TO]/Vulcan/packages" meteor --port 3000 --settings settings.json
```

## Note
There are secrets that are not on Github — for the database, for phone number validation and formatting, for search. This install has a limited amount of seed data, and skips some functionality.
