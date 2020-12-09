# **Octave** README

## Description

**Octave** is a place to collaborate and share information.

## Technologies

**Octave** is built with:

- [Vulcan](http://vulcanjs.org/), the “full-stack React+GraphQL framework,”
built with:
  - [React](https://reactjs.org/)
  - [GraphQL](https://graphql.org/)
  - [Meteor](https://www.meteor.com/)
  - [Apollo](https://www.apollographql.com/)
  - [MongoDB](https://www.mongodb.com/)
- Bootstrap ([react-boostrap](https://react-bootstrap.github.io/),
[SCSS](https://sass-lang.com/documentation/syntax#scss), [node-sass](https://github.com/sass/node-sass))
- [Algolia](https://www.algolia.com/)
- [Mailgun](https://www.mailgun.com/)
- [Mockaroo](https://mockaroo.com/)
- [Storybook](https://storybook.js.org/)
- [Twilio](https://www.twilio.com/)

Octave lists Contacts, Offices, Projects and Past Projects, and provides an
expanded editing interface for admins. Using Vulcan’s
[hooks and callbacks](https://docs.vulcanjs.org/callbacks.html), related records
are transformed upon editing the original record. Brill.

## How to Install

### Prerequisites

Have these tools installed first:

- Meteor
- Node
- NPM

### Installation Steps

1. Clone [my fork](https://github.com/kevinashworth/Vulcan) of the [main Vulcan
repo](https://github.com/VulcanJS/Vulcan). Be sure to check out branch
[`Octave`](https://github.com/kevinashworth/Vulcan/tree/Octave). (There is no
need to do more than clone this repo on the correct branch.)
2. Clone this **Octave** repo, then `cd` into its directory.
3. Rename `sample_settings.json` to `settings.json`.
4. Run `npm install --production`.<sup>1</sup> (If you want to do development or download the large e2e testing packages, omit the `--production` flag.)
5. As per Vulcan’s [Two-Repo Install](https://docs.vulcanjs.org/#Two-Repo-Install-Optional),
start **Octave** with `METEOR_PACKAGE_DIRS="/[YOUR_PATH_TO]/Vulcan/packages"
meteor --port 4004 --settings settings.json`.
6. When this command finishes after a few minutes, launch **Octave** by visiting
<http://localhost:4004> in your browser.
7. Click Sign Up and enter username, email, and password.<sup>2</sup>
8. That’s it. You’re in!


## Notes

There are secrets that are not on Github — for the real **Octave** database, for
phone number validation and formatting, for search. This publicly available
version has a limited amount of seed data, and skips some functionality. There
is a secret, alternative install procedure to get to full functionality.

<sup>1</sup> Near the end of the `install` process, you will see messages about
contacts, offices, etc. This is seed data being randomly generated via Mockaroo.
You can re-run this seeding process by typing `npm run prepare`. To replace old
seed data with new seed data, run `meteor reset`, which will clear out the
existing Mongo data, and delete the `mockaroo/generated` and `packages/Octave/lib/server/seeds/generated`
directories. Then the `npm` command `install` or `prepare` will trigger a
re-seeding of the database on the next **Octave** launch.

<sup>2</sup> This first user that you create will automatically become a user
with `admin` permissions. The email that you enter will not be used, so it can
be valid or a dummy value. Also, you may need to click menu items after logging
in the first time, despite the message that ‘This will just take a moment.’ On
subsequent logins this screen will only appear momentarily.
