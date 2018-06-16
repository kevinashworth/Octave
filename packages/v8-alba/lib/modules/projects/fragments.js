import { registerFragment } from "meteor/vulcan:core";

registerFragment(/* GraphQL */ `
  fragment ProjectsItemFragment on Project {
    _id
    createdAt
    updatedAt
    userId
    displayName
    slug
  }
`);

registerFragment(/* GraphQL */ `
  fragment ProjectsSingleFragment on Project {
    _id
    createdAt
    updatedAt
    userId
    projectTitle
    projectType
    castingCompany
    addresses
    contacts
    network
    status
    union
    notes
    logline
    website
    slug
  }
`);

registerFragment(/* GraphQL */ `
  fragment ProjectsEditFragment on Project {
    _id
    projectTitle
    projectType
    contacts
    addresses
    status
    union
  }
`);
