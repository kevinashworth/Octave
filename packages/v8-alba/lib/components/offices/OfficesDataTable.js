import { Components, registerComponent, withMulti } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardBody, CardFooter, CardHeader } from 'reactstrap'
import BootstrapTable  from 'react-bootstrap-table-next'
import moment from 'moment'
import { DATE_FORMAT_SHORT } from '../../modules/constants.js'
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
    const displayNameFormatter = (cell, row) => {
      return (
        <Link to={`/offices/${row._id}/${row.slug}`}>
          {cell}
        </Link>
      )
    }
    const loadingIndicator = () => {
      if (this.props.loading) {
        return <Components.Loading />
      } else {
        return 'There is no data to display'
      }
    }
    const dateFormatter = (cell, row) => {
      return moment(cell).format(DATE_FORMAT_SHORT)
    }
    const columns = [{
      dataField: 'displayName',
      text: 'Office',
      formatter: displayNameFormatter,
      sort: true
    }, {
      dataField: 'fullAddress',
      text: 'Address',
      style: {'white-space': 'nowrap'},
      sort: true
    }, {
      dataField: 'updatedAt',
      text: 'Updated',
      formatter: dateFormatter,
      align: 'right',
      headerAlign: 'right',
      sort: true
    }]
    const defaultSorted = [{
      dataField: 'displayName',
      order: 'desc'
    }]

    return (
      <div className='animated fadeIn'>
        <Card>
          <CardHeader>
            <i className='icon-people' />Offices
          </CardHeader>
          <CardBody>
            <BootstrapTable
              keyField='_id'
              bootstrap4 condensed striped hover
              data={results}
              columns={columns}
              noDataIndication={loadingIndicator}
              defaultSorted={defaultSorted}
              bordered={false} />
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
