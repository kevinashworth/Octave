import { Components, registerComponent, withCurrentUser, withMulti } from 'meteor/vulcan:core'
import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, ListGroup, ListGroupItem } from 'reactstrap'
import Algolia from '../../modules/algolia/collection.js'

const AlgoliaLog = ({ loading, loadingMore, loadMore, results = [], currentUser, count, totalCount }) => {
  if (loading) {
    return (<div><Components.Loading /></div>)
  }

  return (
    <div className='animated fadeIn'>
      <Card>
        <CardHeader>
          <i className='icon-search' />Algolia Log
            <div className='float-right'>
              <Button tag={Link} to={'/dummy'}>Send Latest Updates to Algolia</Button>
            </div>
        </CardHeader>
        <CardBody>
          <ListGroup>
            {results.map(o => <ListGroupItem key={o.date}>{o.date}: {o.objectCount}</ListGroupItem>)}
          </ListGroup>
        </CardBody>
      </Card>
    </div>
  )
}

const options = {
  collection: Algolia
}

registerComponent('AlgoliaLog', AlgoliaLog, withCurrentUser, [withMulti, options])
