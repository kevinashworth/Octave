# V8

## Description
A place to collaborate and share information.

## Technologies
V8 is built with:
- Vulcan, the “full-stack React+GraphQL framework,” built also with Meteor, Apollo, and MongoDB
- Bootstrap, SCSS (node-sass)
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
1. Clone the [main Vulcan repo](https://github.com/VulcanJS/Vulcan).
1. Clone this project, then `cd` into its directory.
1. Rename `sample_settings.json` to `settings.json`.
1. Run `npm install`.<sup>1</sup>
1. As per Vulcan’s [Two-Repo Install](https://docs.vulcanjs.org/#Two-Repo-Install-Optional), launch with:
```
METEOR_PACKAGE_DIRS="/[YOUR_PATH_TO]/Vulcan/packages" meteor --port 3000 --settings settings.json
```
1. Once the app is running in your browser, click Sign Up and enter username, email, and password.<sup>2</sup>
1. That’s it. You’re in!

<sup>1</sup> Near the end of the `install` process, you will see messages about contacts, offices, etc. This is seed data being randomly generated via Mockaroo. You can re-run this seeding process by typing `npm run prepare`. To replace old seed data with new seed data, run `meteor reset`, which will clear out the existing Mongo data and trigger a re-seeding of the database.

<sup>2</sup> This first user that you create will automatically become a user with `admin` permissions. The email that you enter will not be used, so it can be valid or a dummy value. Also, you may need to click menu items after logging in the first time, despite the message that ‘This will just take a moment.’ On subsequent logins this screen will only appear momentarily.

## Note
There are secrets that are not on Github — for the real database, for phone number validation and formatting, for search. This publicly available install has a limited amount of seed data, and skips some functionality.
