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
- [Cypress](https://cypress.io/)
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
- Node.js
- npm

### Installation Steps

1. Clone [my fork of Vulcan](https://github.com/kevinashworth/Vulcan).
2. Check out branch [`octave`](https://github.com/kevinashworth/Vulcan/tree/Octave).
3. As per Vulcan’s [Two-Repo Install](https://docs.vulcanjs.org/#Two-Repo-Install-Optional), `export METEOR_PACKAGE_DIRS="/[YOUR_PATH_TO]/Vulcan/packages"`.
4. Clone this **Octave** repo, then `cd` into its directory.
5. Rename `sample_settings.json` to `settings.json`.
6. Run the command `npm install`.
7. Run the script that is available for public testing, `npm run start-public-testing`.
8. When this command finishes after a few minutes, launch **Octave** by visiting <http://localhost:4004> in your browser.
9. Click Sign Up and enter the username, email, and password of your choosing.
10. That’s it. You’re in!

## Note

The sign-up email that you enter will not be used, so it can be valid, or a dummy value.
When you first sign up, you will have limited permissions.
There are secrets that are not on Github — for access to all objects, for access to the real **Octave** database, for Twilio
phone number validation and formatting, for full Algolia search, etc.
There is an alternative method of setting up to get it all. DM me.
