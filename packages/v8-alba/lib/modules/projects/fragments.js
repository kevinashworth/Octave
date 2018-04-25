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
    projectTitle
    projectType
    status
    union
  }
`);
