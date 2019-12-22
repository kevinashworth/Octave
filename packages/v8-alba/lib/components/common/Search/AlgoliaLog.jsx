import { Components, registerComponent, withCurrentUser, withSingle2, withUpdate } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import { Button, Card, CardBody, CardHeader } from 'reactstrap'
import pick from 'lodash/pick'
import Algolia from '../../../modules/algolia-log/collection.js'
import { updateAlgoliaIndex } from '../../../modules/algolia-log/helpers.js'

class AlgoliaLog extends PureComponent {
  constructor (props) {
    super(props)
  }

  updateAlgolia = (algoliaLogArg) => {
    const logItem = updateAlgoliaIndex(algoliaLogArg)
    let updatedAlgolia = pick(algoliaLogArg.algolia, ['dateOfSend', 'sentObjectCount'])
    updatedAlgolia.push(logItem)

    console.group('[KA] AlgoliaLog/updateAlgolia about to:')
    console.log('logItem:', logItem)
    console.log('updatedAlgolia:', updatedAlgolia)
    console.groupEnd()

    this.props
      .updateAlgoliaLog({
        _id: '4nzN3n756Xfvbctot',
        data: {
          algolia: updatedAlgolia
        }
      })
      .then(response => {
        console.group('[KA] updateAlgolia response:')
        console.log(response)
        console.groupEnd()
      })
      .catch(err => {
        console.error('[KA] updateAlgolia error:', err)
      })
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

const single2Options = {
  collection: Algolia,
  fragmentName: 'AlgoliaLogsDefaultFragment'
}

const updateOptions = {
  collection: Algolia
}

registerComponent({
  name: 'AlgoliaLog',
  component: AlgoliaLog,
  hocs: [
    withCurrentUser,
    [withSingle2, single2Options],
    [withUpdate, updateOptions]
  ]
})
