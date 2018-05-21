import { registerFragment } from "meteor/vulcan:core";

registerFragment(/* GraphQL */ `
  fragment OfficesItemFragment on Office {
    _id
    createdAt
    updatedAt
    userId
    displayName
    slug
  }
`);

registerFragment(/* GraphQL */ `
  fragment OfficesDetailsFragment on Office {
    _id
    createdAt
    updatedAt
    userId
    displayName
    body
    links
    projectIds
    contactIds
    street1
    street2
    city
    state
    zip
    slug
  }
`);

registerFragment(/* GraphQL */ `
  fragment OfficesEditFragment on Office {
    displayName
    body
    links
    projectIds
    contactIds
    street1
    street2
    city
    state
    zip
  }
`);
