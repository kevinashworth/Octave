# **V8** README

## Description
**V8** is a place to collaborate and share information.

## Technologies
**V8** is built with:

- Vulcan, the “full-stack React+GraphQL framework,” built with React, GraphQL, Meteor, Apollo, MongoDB
- Bootstrap, react-boostrap, SCSS / node-sass
- Algolia
- Mockaroo
- Storybook
- Twilio

## How to Install

### Prerequisites
Have these tools installed first:

* Meteor
* Node
* NPM

### Installation Steps
1. Clone [my fork](https://github.com/kevinashworth/Vulcan) of the [main Vulcan repo](https://github.com/VulcanJS/Vulcan). Be sure to check out branch `v8`. (There is no need to do more than clone this repo on the correct branch.)
1. Clone this **V8** repo, then `cd` into its directory.
1. Rename `sample_settings.json` to `settings.json`.
1. Run `npm install`.<sup>1</sup>
1. As per Vulcan’s [Two-Repo Install](https://docs.vulcanjs.org/#Two-Repo-Install-Optional), start **V8** with `METEOR_PACKAGE_DIRS="/[YOUR_PATH_TO]/Vulcan/packages" meteor --port 4004 --settings settings.json`.
1. When this command finishes after a few minutes, launch **V8** by visiting <http://localhost:4004> in your browser.
1. Click Sign Up and enter username, email, and password.<sup>2</sup>
1. That’s it. You’re in!


## Notes
There are secrets that are not on Github — for the real **V8** database, for phone number validation and formatting, for search. This publicly available version has a limited amount of seed data, and skips some functionality. There is a secret, alternative install procedure to get to full functionality.

<sup>1</sup> Near the end of the `install` process, you will see messages about contacts, offices, etc. This is seed data being randomly generated via Mockaroo. You can re-run this seeding process by typing `npm run prepare`. To replace old seed data with new seed data, run `meteor reset`, which will clear out the existing Mongo data, and delete the `mockaroo/generated` and `packages/v8/lib/server/seeds/generated` directories. Then the `npm` command `install` or `prepare` will trigger a re-seeding of the database on the next **V8** launch.

<sup>2</sup> This first user that you create will automatically become a user with `admin` permissions. The email that you enter will not be used, so it can be valid or a dummy value. Also, you may need to click menu items after logging in the first time, despite the message that ‘This will just take a moment.’ On subsequent logins this screen will only appear momentarily.
