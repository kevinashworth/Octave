import { Components } from 'meteor/vulcan:core'
import React from 'react'
import Card from 'react-bootstrap/Card'
import { BootstrapTable, ClearSearchButton, TableHeaderColumn } from 'react-bootstrap-table'
import MyLoading from '../common/MyLoading'
import { INITIAL_SIZE_PER_PAGE, LOADING_PROJECTS_DATA, SIZE_PER_PAGE_LIST_SEED } from '../../modules/constants.js'
import { renderShowsTotal } from '../../modules/helpers.js'

const MyLoadingPrimary = () => <MyLoading variant='primary' />

const AddButtonFooter = () => {
  return (
    <Card.Footer>
      <Components.ModalTrigger title='New Project' label='Add a Project'>
        {' '}
      </Components.ModalTrigger>
    </Card.Footer>
  )
}

const ProjectsDataTableLoading = (props) => {
  const createCustomClearButton = () => {
    return (
      <ClearSearchButton
        btnContextual='btn-secondary'
        className='btn-sm'
      />
    )
  }

  return (
    <div className='animated fadeIn'>
      <Card className='card-accent-danger'>
        <Card.Header>
          <i className='fa fa-camera' />Projects
          <Components.ProjectFilters />
        </Card.Header>
        <Card.Body>
          <BootstrapTable
            bordered={false}
            condensed
            data={LOADING_PROJECTS_DATA}
            keyField='_id'
            options={{
              sizePerPage: INITIAL_SIZE_PER_PAGE,
              paginationSize: 5,
              prePage: '‹',
              nextPage: '›',
              firstPage: '«',
              lastPage: '»',
              paginationShowsTotal: renderShowsTotal,
              paginationPosition: 'top',
              clearSearch: true,
              clearSearchBtn: createCustomClearButton,
              sizePerPageList: SIZE_PER_PAGE_LIST_SEED
            }}
            pagination
            search
            striped
            version='4'
          >
            <TableHeaderColumn dataField='projectTitle' dataFormat={MyLoadingPrimary} dataSort width='25%'>Name</TableHeaderColumn>
            <TableHeaderColumn dataField='casting' dataFormat={MyLoading} dataSort>Casting</TableHeaderColumn>
            <TableHeaderColumn dataField='network' dataFormat={MyLoading} dataSort>Network</TableHeaderColumn>
            <TableHeaderColumn dataField='projectType' dataFormat={MyLoading} dataSort>Type</TableHeaderColumn>
            <TableHeaderColumn dataField='status' dataFormat={MyLoading} dataSort width='94px'>Status</TableHeaderColumn>
            <TableHeaderColumn dataField='updatedAt' dataFormat={MyLoading} dataSort dataAlign='right' width='94px'>Updated</TableHeaderColumn>
          </BootstrapTable>
        </Card.Body>
        <AddButtonFooter />
      </Card>
    </div>
  )
}

export default ProjectsDataTableLoading
