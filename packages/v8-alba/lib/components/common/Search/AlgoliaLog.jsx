import { Components, registerComponent, withCurrentUser, withSingle2 } from 'meteor/vulcan:core'
import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader } from 'reactstrap'
import Algolia from '../../../modules/algolia/collection.js'

const AlgoliaLog = ({ loading, document, currentUser, count, totalCount }) => {
  if (loading) {
    return (<div><Components.Loading /></div>)
  }

  console.log('[KA] AlgoliaLog document:', document)
  console.log('[KA] AlgoliaLog document.algolia:', document.algolia)

  return (
    <div className='animated fadeIn'>
      <Card>
        <CardHeader>
          <i className='fa fa-search' />Algolia Log
            <div className='float-right'>
              <Button tag={Link} to={'/dummy'}>Send Latest Updates to Algolia</Button>
            </div>
        </CardHeader>
        <CardBody>
          <Components.Datatable
            showSearch={false}
            showNew={false}
            showEdit={false}
            data={document.algolia}
          />
        </CardBody>
      </Card>
    </div>
  )
}

const options = {
  collection: Algolia
}

registerComponent('AlgoliaLog', AlgoliaLog, withCurrentUser, [withSingle2, options])
