const project = `
  query project($input: SingleProjectInput!) {
    project(input: $input) {
      result {
        ...ProjectsSingleFragment
        __typename
      }
      __typename
    }
  }

  fragment ProjectsSingleFragment on Project {
    ...ProjectsDataTableFragment
    links {
      platformName
      profileLink
      profileName
      __typename
    }
    __typename
  }

  fragment ProjectsDataTableFragment on Project {
    _id
    createdAt
    updatedAt
    userId
    projectTitle
    sortTitle
    projectType
    offices {
      officeId
      officeLocation
      officeName
      __typename
    }
    status
    network
    union
    summary
    notes
    htmlSummary
    htmlNotes
    allContactNames
    contacts {
      contactId
      contactName
      contactTitle
      __typename
    }
    slug
    __typename
  }
`

module.exports = {
  graphql: {
    project
  }
}
