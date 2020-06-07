import { Components, registerComponent } from 'meteor/vulcan:core'
// import { getFragmentText } from 'meteor/vulcan:lib'
// import Users from 'meteor/vulcan:users'
import React from 'react'
// import { LinkContainer } from 'react-router-bootstrap'
// import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
// import Projects from '../../modules/projects/collection.js'
import { DATATABLE_PROJECTS } from '../../modules/projects/fragments.js'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

const GET_PROJECTS = gql`
  query ($limit: Int, $offset: Int) {
    projects(input: {limit: $limit, offset: $offset}) {
      totalCount
      results ${DATATABLE_PROJECTS}
    }
  }
`

console.log('GET_PROJECTS:', GET_PROJECTS)
// const GET_PROJECTS = gql`${getFragment('ProjectsDataTableFragment')}`

const ApolloTest = (props) => {
  const { loading, error, data, fetchMore } = useQuery(GET_PROJECTS, {
    variables: {
      offset: 0,
      limit: 50
    }
  })
  if (loading) return <Components.Loading />
  if (error) return `Error! ${error.message}`

  // const f = getFragmentText('ProjectsDataTableFragment')
  // console.log('f:', f)

  const resolverName = 'projects'
  const projects = data.projects.results
  const totalCount = data.projects.totalCount
  const count = projects.length
  if (count < totalCount) {
    fetchMore({
      variables: {
        offset: count,
        limit: totalCount
      },
      updateQuery: (previousResults, { fetchMoreResult }) => {
        if (!(
          fetchMoreResult[resolverName] &&
          fetchMoreResult[resolverName].results &&
          fetchMoreResult[resolverName].results.length
        )) {
          return previousResults
        }
        const newResults = {
          ...previousResults,
          [resolverName]: { ...previousResults[resolverName] }
        }
        newResults[resolverName].results = [
          ...previousResults[resolverName].results,
          ...fetchMoreResult[resolverName].results
        ]
        return newResults
      }
    })
  }

  console.log('fetchMore:', fetchMore)

  return (
    <div className='animated fadeIn'>
      <Components.HeadTags title='V8: Test' />
      <Card className='card-accent-danger'>
        <Card.Header>TEST (totalCount: {totalCount} / count: {count})</Card.Header>
        <Card.Body>
          {projects.map((project, index) => (
            <p key={index}>{project.sortTitle}</p>
          ))}
        </Card.Body>
      </Card>
    </div>
  )
}

registerComponent({
  name: 'ApolloTest',
  component: ApolloTest
})

// ProjectsSingle.propTypes = {
//   documentId: PropTypes.string.isRequired,
//   document: PropTypes.object
// }
//
// const options = {
//   collection: Projects,
//   fragmentName: 'ProjectsSingleFragment'
// }
//
// const mapPropsFunction = props => ({ ...props, documentId: props.match && props.match.params._id })
//
// registerComponent({
//   name: 'ProjectsSingle',
//   component: ProjectsSingle,
//   hocs: [
//     withCurrentUser,
//     mapProps(mapPropsFunction), [withSingle, options] // mapProps must precede withSingle
//   ]
// })
