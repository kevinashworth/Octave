import { Components, registerComponent, withCurrentUser, withMulti } from 'meteor/vulcan:core'
import React from 'react'
import { Button, Card, CardBody, CardFooter, CardHeader, ListGroup } from 'reactstrap'
import Offices from '../../modules/offices/collection.js'

const OfficesListGroup = ({ loading, loadingMore, loadMore, results = [], currentUser, count, totalCount }) => {
  const hasMore = results && (totalCount > results.length)
  return (
    <div className='animated fadeIn'>
      <Card>
        <CardHeader>
          <i className='icon-briefcase' />Offices as ListGroup
        </CardHeader>
        <CardBody>
          <ListGroup>
            {results.map(office => <Components.OfficesItem key={office._id} documentId={office._id} currentUser={currentUser} />)}
          </ListGroup>
        </CardBody>
        {hasMore &&
          <CardFooter>
            {loadingMore
              ? <Components.Loading />
              : <Button onClick={e => { e.preventDefault(); loadMore() }}>Load More ({count}/{totalCount})</Button>
            }
          </CardFooter>
        }
      </Card>
    </div>
  )
}

const options = {
  collection: Offices,
  fragmentName: 'OfficesSingleFragment',
  limit: 20
}

registerComponent('OfficesListGroup', OfficesListGroup, withCurrentUser, [withMulti, options])
