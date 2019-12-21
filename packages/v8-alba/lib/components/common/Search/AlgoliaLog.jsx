import { Components, registerComponent, withCurrentUser, withSingle2 } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import { Button, Card, CardBody, CardHeader } from 'reactstrap'
import Algolia from '../../../modules/algolia-log/collection.js'
import { updateAlgoliaIndex } from '../../../modules/algolia-log/helpers.js'

class AlgoliaLog extends PureComponent {
  constructor () {
    super()
    this.state = {
      modalIsOpen: false
    }
  }

  updateAlgolia = (algoliaLog) => {
    updateAlgoliaIndex(algoliaLog)
  }

  render () {
    const { loading, document } = this.props
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
                <Button onClick={() => this.updateAlgolia(document)}>Send Latest Updates to Algolia</Button>
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
}

const options = {
  collection: Algolia
}

registerComponent('AlgoliaLog', AlgoliaLog, withCurrentUser, [withSingle2, options])
