import { registerFragment } from 'meteor/vulcan:core'

registerFragment(/* GraphQL */ `
  fragment ProjectsItemFragment on Project {
    _id
    createdAt
    updatedAt
    userId
    projectTitle
    casting
    castingCompany
    castingOffices{
      castingLocation
      castingOfficeId
    }
    slug
  }
`)

registerFragment(/* GraphQL */ `
  fragment ProjectsSingleFragment on Project {
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
    castingOffices{
      castingLocation
      castingOfficeId
    }
    addresses {
      street1
      street2
      city
      state
      zip
      location
      addressType
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
  fragment ProjectsDataTableFragment on Project {
    _id
    createdAt
    updatedAt
    projectTitle
    sortTitle
    projectType
    platformType
    casting
    castingCompany
    castingOffices{
      castingLocation
      castingOfficeId
    }
    castingOfficeId
    castingOffice{
      displayName
    }
    status
    network
    union
    summary
    website
    notes
    htmlSummary
    htmlNotes
    allContactNames
    allAddresses
    addresses {
      street1
      street2
      city
      state
      zip
      location
      addressType
    }
    contacts {
      contactId
      contactName
      contactTitle
    }
    slug
  }
`)

registerFragment(/* GraphQL */ `
  fragment ProjectsPatchesFragment on Project {
    projectTitle
    projectType
    shootingLocation
    castingCompany
    castingOffices{
      castingLocation
      castingOfficeId
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
  fragment ProjectsEditFragment on Project {
    _id
    createdAt
    updatedAt
    userId
    projectTitle
    projectType
    shootingLocation
    castingCompany
    castingOffices{
      castingLocation
      castingOfficeId
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
      addressType
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
