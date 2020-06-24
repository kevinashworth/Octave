import { Components, registerComponent, useMulti2 } from 'meteor/vulcan:core'
import React from 'react'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Projects from '../../modules/projects/collection.js'
import { PROJECT_TYPES_EPISODICS, PROJECT_TYPES_FEATURES, PROJECT_TYPES_PILOTS, PROJECT_TYPES_OTHERS } from '../../modules/constants.js'

const StatisticsCurrent = () => {
  const { loading: loadingE, error: errorE, totalCount: episodicsCasting } = useMulti2({
    collection: Projects,
    input: {
      enableCache: true,
      filter: {
        projectType: { _in: PROJECT_TYPES_EPISODICS },
        status: { _eq: 'Casting' }
      }
    }
  })

  const { loading: loadingF, error: errorF, totalCount: featuresCasting } = useMulti2({
    collection: Projects,
    input: {
      enableCache: true,
      filter: {
        projectType: { _in: PROJECT_TYPES_FEATURES },
        status: { _eq: 'Casting' }
      }
    }
  })

  const { loading: loadingP, error: errorP, totalCount: pilotsCasting } = useMulti2({
    collection: Projects,
    input: {
      enableCache: true,
      filter: {
        projectType: { _in: PROJECT_TYPES_PILOTS },
        status: { _eq: 'Casting' }
      }
    }
  })

  const { loading: loadingO, error: errorO, totalCount: othersCasting } = useMulti2({
    collection: Projects,
    input: {
      enableCache: true,
      filter: {
        projectType: { _in: PROJECT_TYPES_OTHERS },
        status: { _eq: 'Casting' }
      }
    }
  })

  if (loadingE || loadingF || loadingP || loadingO) {
    return <Components.Loading />
  }

  if (errorE) console.log('errorE:', errorE)
  if (errorF) console.log('errorF:', errorF)
  if (errorP) console.log('errorP:', errorP)
  if (errorO) console.log('errorO:', errorO)

  return (
    <Card className='card-accent-warning'>
      <Card.Header>Current Statistics</Card.Header>
      <Card.Body>
        <ListGroup className='statistics-lists'>
          <ListGroup.Item>Episodics Casting: {episodicsCasting}</ListGroup.Item>
          <ListGroup.Item>Features Casting: {featuresCasting}</ListGroup.Item>
          <ListGroup.Item>Pilots Casting: {pilotsCasting}</ListGroup.Item>
          <ListGroup.Item>Others Casting: {othersCasting}</ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  )
}

registerComponent({
  name: 'StatisticsCurrent',
  component: StatisticsCurrent
})
