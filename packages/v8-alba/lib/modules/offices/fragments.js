import { registerFragment } from 'meteor/vulcan:core'

registerFragment(/* GraphQL */ `
  fragment OfficesItemFragment on Office {
    _id
    createdAt
    updatedAt
    userId
    displayName
    slug
  }
`)

registerFragment(/* GraphQL */ `
  fragment OfficesSingleFragment on Office {
    _id
    createdAt
    updatedAt
    userId
    displayName
    body
    htmlBody
    links
    projects
    theProjects {
      _id
      projectTitle
    }
    pastProjects
    contacts
    theContacts {
      _id
      displayName
    }
    addresses
    street
    location
    fullAddress
    theStreet
    theCity
    theState
    theLocation
    slug
  }
`)

registerFragment(/* GraphQL */ `
  fragment OfficesDataTableFragment on Office {
    _id
    createdAt
    updatedAt
    displayName
    fullAddress
    body
    slug
  }
`)

registerFragment(/* GraphQL */ `
  fragment OfficesEditFragment on Office {
    _id
    createdAt
    updatedAt
    userId
    displayName
    body
    links
    projects
    contacts
    addresses
    street
    location
    fullAddress
    theStreet
    theCity
    theState
    theLocation
    slug
  }
`)
