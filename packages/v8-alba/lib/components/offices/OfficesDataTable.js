import { Components, registerComponent, withMulti } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import { Card, CardBody, CardFooter, CardHeader } from 'reactstrap'
import BootstrapTable  from 'react-bootstrap-table-next'
import Offices from '../../modules/offices/collection.js'

// Set initial state. Just options I want to keep.
// See https://github.com/amannn/react-keep-state
let keptState = {
  defaultSearch: '',
  page: 1,
  sizePerPage: 20,
  sortName: 'updatedAt',
  sortOrder: 'desc'
}

class OfficesDataTable extends PureComponent {
  render () {
    const { results } = this.props
    const columns = [
      {
        dataField: 'displayName',
        text: 'Office'
      }, {
        dataField: 'fullAddress',
        text: 'Address'
      }]

    return (
      <div className='animated fadeIn'>
        <Card>
          <CardHeader>
            <i className='icon-people' />Offices
          </CardHeader>
          <CardBody>
            <BootstrapTable keyField='_id' data={results} columns={columns} condensed striped hover />
          </CardBody>
          <CardFooter>
            <i className='icon-people' />Offices
          </CardFooter>
        </Card>
      </div>
    )
  }
}

const options = {
  collection: Offices,
  fragmentName: 'OfficesDataTableFragment',
  limit: 1000
}

registerComponent('OfficesDataTable', OfficesDataTable, [withMulti, options])
