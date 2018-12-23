import { registerFragment } from 'meteor/vulcan:core'

registerFragment(/* GraphQL */ `
  fragment PastProjectsItemFragment on PastProject {
    _id
    createdAt
    updatedAt
    userId
    projectTitle
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
    castingCompany
    castingOffice
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
    logline
    htmlLogline
    website
    season
    order
    links
    slug
  }
`)

registerFragment(/* GraphQL */ `
  fragment PastProjectsEditFragment on PastProject {
    _id
    projectTitle
    projectType
    castingCompany
    castingOffice
    contacts
    addresses
    network
    status
    union
    notes
    htmlNotes
    logline
    htmlLogline
    website
    season
    order
    slug
  }
`)
