import { registerFragment } from "meteor/vulcan:core";

registerFragment(/* GraphQL */ `
  fragment ContactsItemFragment on Contact {
    _id
    createdAt
    userId
    displayName
  }
`);

registerFragment(/* GraphQL */ `
  fragment ContactsDetailsFragment on Contact {
    _id
    createdAt
    userId
    displayName
    body
    street1
    street2
    city
    state
    zip
    slug
  }
`);
