import { registerFragment } from 'meteor/vulcan:core'

registerFragment(/* GraphQL */ `
  fragment PastProjectsItemFragment on PastProject {
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
  fragment PastProjectsSingleFragment on PastProject {
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
  fragment PastProjectsDataTableFragment on PastProject {
    _id
    createdAt
    updatedAt
    projectTitle
    projectType
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

registerFragment(/* GraphQL */ `
  fragment PastProjectsEditFragment on PastProject {
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
    network
    status
    union
    notes
    htmlNotes
    summary
    htmlSummary
    website
    season
    order
    slug
  }
`)
