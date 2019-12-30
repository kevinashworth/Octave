// test-twilio.js

// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
const accountSid = '***REMOVED***';
const authToken = '***REMOVED***';
const client = require('twilio')(accountSid, authToken);

client.lookups.phoneNumbers('310.993.7136')
              .fetch({countryCode: 'US'})
              .then(phone_number => console.log(phone_number));
