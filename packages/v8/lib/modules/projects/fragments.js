import { registerFragment } from 'meteor/vulcan:core'

export const DATATABLE_PROJECTS = /* GraphQL */ `{
  _id
  createdAt
  updatedAt
  userId
  projectTitle
  sortTitle
  projectType
  platformType
  casting
  castingCompany
  offices {
    officeId
    officeLocation
    officeName
  }
  status
  network
  union
  summary
  website
  notes
  htmlSummary
  htmlNotes
  shootingLocation
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
  allContactNames
  contacts {
    contactId
    contactName
    contactTitle
  }
  slug
}`

registerFragment(/* GraphQL */ `fragment ProjectsDataTableFragment on Project ${DATATABLE_PROJECTS}`)

registerFragment(/* GraphQL */ `
  fragment ProjectsSingleFragment on Project {
    ...ProjectsDataTableFragment
    renewed
    season
    order
    links {
      platformName
      profileLink
      profileName
    }
  }
`)
