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
    allLinks
    addresses
    allAddresses
    theAddress
    projects
    pastProjects
    offices
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
    theAddress
    projects
    pastProjects
    slug
  }
`)
