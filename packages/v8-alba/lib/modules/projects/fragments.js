import { registerFragment } from 'meteor/vulcan:core'

registerFragment(/* GraphQL */ `
  fragment ProjectsItemFragment on Project {
    _id
    createdAt
    updatedAt
    userId
    projectTitle
    casting
    castingCompany
    castingOfficeId
    castingOffice{
      displayName
    }
    slug
  }
`)

registerFragment(/* GraphQL */ `
  fragment ProjectsSingleFragment on Project {
    _id
    createdAt
    updatedAt
    userId
    projectTitle
    projectType
    platformType
    casting
    castingCompany
    castingOfficeId
    castingOffice{
      displayName
    }
    addresses
    allAddresses
    contacts
    allContactNames
    network
    status
    renewed
    union
    notes
    htmlNotes
    summary
    htmlSummary
    website
    season
    order
    links
    slug
  }
`)

registerFragment(/* GraphQL */ `
  fragment ProjectsDataTableFragment on Project {
    _id
    createdAt
    updatedAt
    projectTitle
    projectType
    platformType
    casting
    status
    network
    union
    summary
    notes
    htmlSummary
    htmlNotes
    allContactNames
    allAddresses
    slug
  }
`)

registerFragment( /* GraphQL */ `
  fragment ProjectsEditFragment on Project {
    _id
    createdAt
    updatedAt
    userId
    projectTitle
    projectType
    castingCompany
    castingOfficeId
    contacts
    addresses
    allAddresses
    allContactNames
    network
    status
    renewed
    union
    notes
    htmlNotes
    summary
    htmlSummary
    website
    season
    order
    links
    slug
  }
`)
