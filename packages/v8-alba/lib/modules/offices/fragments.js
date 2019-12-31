import { registerFragment } from 'meteor/vulcan:core'

registerFragment(/* GraphQL */ `
  fragment OfficesSingleFragment on Office {
    _id
    createdAt
    updatedAt
    userId
    displayName
    body
    htmlBody
    slug
    contacts {
      contactId
      contactName
      contactTitle
    }
    theContacts {
      _id
      displayName
    }
    addresses {
      street1
      street2
      city
      state
      zip
      location
    }
    street
    location
    fullAddress
    theStreet
    theCity
    theState
    theLocation
    projects {
      projectId
      projectTitle
    }
    theProjects {
      _id
      projectTitle
      sortTitle
    }
    phones {
      phoneNumberAsInput
      phoneNumberType
      phoneNumber
      nationalFormat
    }
    pastProjects {
      projectId
      projectTitle
    }
    links {
      platformName
      profileLink
      profileName
    }
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
    links {
      platformName
      profileLink
      profileName
    }
    projects {
      projectId
      projectTitle
    }
    contacts {
      contactId
      contactName
      contactTitle
    }
    addresses {
      street1
      street2
      city
      state
      zip
      location
    }
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
