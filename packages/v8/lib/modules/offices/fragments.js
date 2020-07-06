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
    allContactNames
    addresses {
      street1
      street2
      city
      state
      zip
      location
      addressType
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
    allContactNames
    body
    slug
  }
`)

registerFragment(/* GraphQL */`
  fragment DirectlyEditableFields on Office {
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
    pastProjects {
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
      addressType
    }
  }
`)

registerFragment(/* GraphQL */ `
  fragment OfficesPatchesFragment on Office {
    ...DirectlyEditableFields
    htmlBody
    theContacts {
      _id
      displayName
    }
    theProjects {
      _id
      projectTitle
    }
    slug
  }
`)

registerFragment(/* GraphQL */ `
  fragment OfficesEditFragment on Office {
    _id
    ...DirectlyEditableFields
    slug
  }
`)
