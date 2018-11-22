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

registerFragment(/* GraphQL */ `
  fragment OfficesEditFragment on Office {
    displayName
    body
    links
    projects
    contacts
    addresses
    street
    location
  }
`)
