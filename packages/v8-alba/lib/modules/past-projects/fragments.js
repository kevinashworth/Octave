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
    shootingLocation
    casting
    castingCompany
    castingOfficeId
    castingOffice{
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
    allAddresses
    contacts {
      contactId
      contactName
      contactTitle
    }
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
    links {
      platformName
      profileLink
      profileName
    }
    slug
  }
`)

registerFragment(/* GraphQL */ `
  fragment PastProjectsDataTableFragment on PastProject {
    _id
    createdAt
    updatedAt
    projectTitle
    sortTitle
    projectType
    platformType
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
  fragment PastProjectsPatchesFragment on PastProject {
    projectTitle
    projectType
    shootingLocation
    castingCompany
    castingOfficeId
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
    links {
      platformName
      profileLink
      profileName
    }
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
    shootingLocation
    castingCompany
    castingOfficeId
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
    allAddresses
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
    links {
      platformName
      profileLink
      profileName
    }
    slug
  }
`)
