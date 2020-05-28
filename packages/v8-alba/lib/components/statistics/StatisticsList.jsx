import { Components, registerComponent, withCurrentUser, withMulti } from 'meteor/vulcan:core'
import React from 'react'
// import { Button, Card, CardBody, CardFooter, CardHeader, ListGroup } from 'reactstrap'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Statistics from '../../modules/statistics/collection.js'

const StatisticsList = ({ loading, loadingMore, loadMore, results = [], currentUser, count, totalCount }) => {
  if (loading) {
    return <Components.Loading />
  }
  const hasMore = results && (totalCount > results.length)
  return (
    <div className='animated fadeIn'>
      <Card>
        <Card.Header>
          <i className='icon-briefcase' />Statistics as ListGroup
        </Card.Header>
        <Card.Body>
          <ListGroup>
            {results.map(statistic => <ListGroup.Item key={statistic._id}><Components.StatisticsEditForm documentId={statistic._id} currentUser={currentUser} /></ListGroup.Item>)}
          </ListGroup>
        </Card.Body>
        {hasMore &&
          <Card.Footer>
            {loadingMore
              ? <Components.Loading />
              : <Button onClick={e => { e.preventDefault(); loadMore() }}>Load More ({count}/{totalCount})</Button>}
          </Card.Footer>}
      </Card>
    </div>
  )
}

const options = {
  collection: Statistics
}

registerComponent('StatisticsList', StatisticsList, withCurrentUser, [withMulti, options])
