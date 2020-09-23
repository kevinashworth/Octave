import { Components, registerComponent } from 'meteor/vulcan:core'
import React from 'react'
import Alert from 'react-bootstrap/Alert'
import Card from 'react-bootstrap/Card'
// import Projects from '../../modules/projects/collection.js'
import { DATATABLE_PROJECTS } from '../../modules/projects/fragments.js'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

const GET_PROJECTS = gql`
  query ($limit: Int, $offset: Int) {
    projects(input: { limit: $limit, offset: $offset }) {
      totalCount
      results ${DATATABLE_PROJECTS}
    }
  }
`

const ApolloTest = (props) => {
  const firstOffset = 0
  const firstLimit = 20

  const { data, error, fetchMore, loading } = useQuery(GET_PROJECTS, {
    variables: {
      offset: firstOffset,
      limit: firstLimit
    }
  })

  if (loading) return <Components.Loading />
  if (error) return <Alert variant='warning'>Error! ${error.message}</Alert>

  const resolverName = 'projects'
  const totalCount = data[resolverName].totalCount
  const projects = data[resolverName].results
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

  return (
    <div className='animated fadeIn'>
      <Components.HeadTags title='V8: Test' />
      <Card className='card-accent-projects'>
        <Card.Header>Apollo Test</Card.Header>
        <Card.Body>
          <Card.Title>Projects (totalCount: {totalCount} / count: {count})</Card.Title>
          {projects.map((project, index) => (
            <Card.Text key={index}>{project.projectTitle} ({project.sortTitle})</Card.Text>
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
