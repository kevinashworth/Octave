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
    projectTitle
    projectType
    casting
    status
    createdAt
    updatedAt
    summary
    notes
    allContactNames
    allAddresses
    network
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
