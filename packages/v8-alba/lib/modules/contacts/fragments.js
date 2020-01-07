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
    links {
      platformName
      profileLink
      profileName
    }
    allLinks
    addresses {
      street1
      street2
      city
      state
      zip
      location
    }
    allAddresses
    theAddress {
      street1
      street2
      city
      state
      zip
      location
    }
    addressString
    projects {
      projectId
      projectTitle
      titleForProject
    }
    pastProjects {
      projectId
      projectTitle
      titleForProject
    }
    offices {
      officeId
    }
    slug
  }
`)

// ContactsOnlyDirectlyEditableFieldsFragment actually includes htmlBody, too
registerFragment(/* GraphQL */ `
  fragment ContactsOnlyDirectlyEditableFieldsFragment on Contact {
    displayName
    firstName
    middleName
    lastName
    gender
    title
    body
    htmlBody
    links {
      platformName
      profileLink
      profileName
    }
    addresses {
      street1
      street2
      city
      state
      zip
    }
    projects {
      projectId
      projectTitle
      titleForProject
    }
    pastProjects {
      projectId
      projectTitle
      titleForProject
    }
    offices {
      officeId
    }
    slug
  }
`)

registerFragment(/* GraphQL */ `
  fragment ContactsDataTableFragment on Contact {
    _id
    displayName
    firstName
    middleName
    lastName
    title
    addressString
    theAddress {
      street1
      street2
      city
      state
      zip
      location
    }
    addresses {
      street1
      street2
      city
      state
      zip
      location
    }
    createdAt
    updatedAt
    allLinks
    body
    slug
  }
`)

registerFragment(/* GraphQL */ `
  fragment ContactsNameOnlyFragment on Contact {
    _id
    displayName
    slug
  }
`)

registerFragment(/* GraphQL */ `
  fragment ContactsEditFragment on Contact {
    _id
    createdAt
    updatedAt
    userId
    fullName
    firstName
    middleName
    lastName
    displayName
    gender
    title
    body
    htmlBody
    links {
      platformName
      profileLink
      profileName
    }
    addresses {
      street1
      street2
      city
      state
      zip
      location
    }
    allAddresses
    theAddress {
      street1
      street2
      city
      state
      zip
      location
    }
    projects {
      projectId
      projectTitle
      titleForProject
    }
    pastProjects {
      projectId
      projectTitle
      titleForProject
    }
    offices {
      officeId
    }
    slug
  }
`)
