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
    links
    projectIds
    contactIds
    contacts {
      _id
      fullName
    }
    street1
    street2
    city
    state
    zip
    slug
  }
`)

registerFragment(/* GraphQL */ `
  fragment OfficesEditFragment on Office {
    displayName
    body
    links
    projectIds
    contactIds
    contacts {
      _id
      fullName
    }
    street1
    street2
    city
    state
    zip
  }
`)
