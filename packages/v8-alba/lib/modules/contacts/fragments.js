import { registerFragment } from 'meteor/vulcan:core'

registerFragment(/* GraphQL */ `
  fragment ContactsItemFragment on Contact {
    _id
    createdAt
    updatedAt
    userId
    displayName
    slug
  }
`)

registerFragment(/* GraphQL */ `
  fragment ContactsSingleFragment on Contact {
    _id
    createdAt
    updatedAt
    userId
    fullName
    displayName
    firstName
    middleName
    lastName
    gender
    title
    body
    htmlBody
    links
    addresses
    location
    street
    street1
    street2
    city
    state
    zip
    projects
    slug
  }
`)

registerFragment(/* GraphQL */ `
  fragment ContactsEditFragment on Contact {
    firstName
    middleName
    lastName
    displayName
    title
    body
    htmlBody
    addresses
    location
    street
    street1
    street2
    city
    state
    zip
    slug
  }
`)
