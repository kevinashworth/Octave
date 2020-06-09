import { Components } from 'meteor/vulcan:core'
import React from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { BootstrapTable, ClearSearchButton, TableHeaderColumn } from 'react-bootstrap-table'
import { SIZE_PER_PAGE_LIST_SEED } from '../../modules/constants.js'
import { renderShowsTotal } from '../../modules/helpers.js'

const dummyProjectRow = {
  _id: '',
  projectTitle: ' ', // em space
  casting: '',
  network: '',
  projectType: '',
  status: '',
  updatedAt: ' ' // em space
}

const DUMMY_PROJECT_DATA = Array(50).fill(dummyProjectRow)

const AddButtonFooter = () => {
  return (
    <Card.Footer>
      <Components.ModalTrigger title='New Project' component={<Button variant='secondary'>Add a Project</Button>}>
        <Components.ProjectsNewForm />
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
            data={DUMMY_PROJECT_DATA}
            keyField='_id'
            options={{
              sizePerPage: 50,
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
            <TableHeaderColumn dataField='projectTitle' dataSort width='25%'>Name</TableHeaderColumn>
            <TableHeaderColumn dataField='casting' dataSort>Casting</TableHeaderColumn>
            <TableHeaderColumn dataField='network' dataSort>Network</TableHeaderColumn>
            <TableHeaderColumn dataField='projectType' dataSort>Type</TableHeaderColumn>
            <TableHeaderColumn dataField='status' dataSort width='94px'>Status</TableHeaderColumn>
            <TableHeaderColumn dataField='updatedAt' dataSort dataAlign='right' width='94px'>Updated</TableHeaderColumn>
          </BootstrapTable>
        </Card.Body>
        <AddButtonFooter />
      </Card>
    </div>
  )
}

export default ProjectsDataTableLoading
