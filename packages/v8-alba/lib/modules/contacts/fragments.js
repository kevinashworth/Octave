import { registerFragment } from "meteor/vulcan:core";

registerFragment(/* GraphQL */ `
  fragment ContactsItemFragment on Contact {
    _id
    createdAt
    updatedAt
    userId
    displayName
    slug
  }
`);

registerFragment(/* GraphQL */ `
  fragment ContactsSingleFragment on Contact {
    _id
    createdAt
    updatedAt
    userId
    fullName
    firstName
    middleName
    lastName
    gender
    title
    body
    links
    street1
    street2
    city
    state
    zip
    projectIds
    slug
  }
`);

registerFragment(/* GraphQL */ `
  fragment ContactsEditFragment on Contact {
    firstName
    middleName
    lastName
    title
    body
    street1
    street2
    city
    state
    zip
  }
`);
