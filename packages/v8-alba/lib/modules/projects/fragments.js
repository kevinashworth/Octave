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
  fragment ProjectsDetailsFragment on Project {
    _id
    createdAt
    updatedAt
    userId
    projectTitle
    projectType
    castingCompany
    addresses
    contactId
    personnel
    network
    status
    union
    notes
    logline
    slug
  }
`);

registerFragment(/* GraphQL */ `
  fragment ProjectsEditFragment on Project {
    _id
    projectTitle
    projectType
    personnel
    contactId
    addresses
    status
    union
  }
`);
