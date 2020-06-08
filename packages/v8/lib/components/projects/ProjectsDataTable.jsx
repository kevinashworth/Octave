import { Components, registerComponent, withAccess, withCurrentUser, withMulti } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Modal from 'react-bootstrap/Modal'
import { BootstrapTable, ClearSearchButton, SearchField, TableHeaderColumn } from 'react-bootstrap-table'
import _ from 'lodash'
import moment from 'moment'
import { SIZE_PER_PAGE_LIST_SEED } from '../../modules/constants.js'
import { dateFormatter, renderShowsTotal, titleSortFunc } from '../../modules/helpers.js'
import Projects from '../../modules/projects/collection.js'
import withFilters from '../../modules/hocs/withFilters.js'

// Set initial state. Just options I want to keep.
// See https://github.com/amannn/react-keep-state
let keptState = {
  searchColor: 'btn-secondary',
  options: {
    defaultSearch: '',
    page: 1,
    sizePerPage: 50,
    sortName: 'projectTitle',
    sortOrder: 'asc'
  }
}

const AddButtonFooter = () => {
  return (
    <Card.Footer>
      <Components.ModalTrigger title='New Project' component={<Button variant='secondary'>Add a Project</Button>}>
        <Components.ProjectsNewForm />
      </Components.ModalTrigger>
    </Card.Footer>
  )
}

const ProjectsDataTable = (props) => {
  const [state, setState] = useState({
    show: false,
    project: null,
    // Retrieve the last state
    ...keptState.searchColor,
    options: {
      ...keptState.options
    }
  })

  // Remember state for the next mount
  useEffect(() => {
    return () => {
      const { options } = state
      keptState = {
        searchColor: options.searchColor,
        options: {
          defaultSearch: options.defaultSearch,
          page: options.page,
          sizePerPage: options.sizePerPage,
          sortName: options.sortName,
          sortOrder: options.sortOrder
        }
      }
    }
  })

  const createCustomClearButton = (onClick) => {
    return (
      <ClearSearchButton
        btnContextual={state.searchColor}
        className='btn-sm'
        onClick={e => handleClearButtonClick(onClick)}
      />
    )
  }

  const createCustomSearchField = (props) => {
    if (props.defaultValue.length && state.searchColor !== 'btn-danger') {
      setState(prevState => {
        return { ...prevState, searchColor: 'btn-danger' }
      })
    } else if (props.defaultValue.length === 0 && state.searchColor !== 'btn-secondary') {
      setState(prevState => {
        return { ...prevState, searchColor: 'btn-secondary' }
      })
    }
    return (
      <SearchField defaultValue={props.defaultValue} />
    )
  }

  const handleClearButtonClick = (onClick) => {
    setState(prevState => {
      return { ...prevState, searchColor: 'btn-secondary' }
    })
    onClick()
  }

  const handleHide = () => {
    if (state.show) {
      setState(prevState => {
        return { ...prevState, show: false }
      })
    }
  }

  const pageChangeHandler = (page, sizePerPage) => {
    setState(prevState => {
      return { ...prevState, options: { ...prevState.options, page, sizePerPage } }
    })
  }

  const rowClickHandler = (row, columnIndex, rowIndex, event) => {
    setState(prevState => {
      return { ...prevState, project: row, show: true }
    })
  }

  const sortChangeHandler = (sortName, sortOrder) => {
    setState(prevState => {
      return { ...prevState, options: { ...prevState.options, sortName, sortOrder } }
    })
  }

  const searchChangeHandler = (searchText) => {
    setState(prevState => {
      return { ...prevState, options: { ...prevState.options, defaultSearch: searchText } }
    })
  }

  const sizePerPageListHandler = (sizePerPage) => {
    setState(prevState => {
      return { ...prevState, options: { ...prevState.options, sizePerPage } }
    })
  }

  const {
    count, currentUser, loadingMore, loadMore, networkStatus, results, totalCount,
    projectTypeFilters, projectStatusFilters, projectUpdatedFilters, projectPlatformFilters
  } = props

  const hasMore = results && (totalCount > results.length)
  var typeFilters = []
  projectTypeFilters.forEach(filter => {
    if (filter.value) { typeFilters.push(filter.projectType) }
  })
  var statusFilters = []
  projectStatusFilters.forEach(filter => {
    if (filter.value) { statusFilters.push(filter.projectStatus) }
  })
  var platformFilters = []
  projectPlatformFilters.forEach(filter => {
    if (filter.value) { platformFilters.push(filter.projectPlatform) }
  })

  const memoizedValue = useMemo(
    () => {
      var momentNumber = 100
      var momentPeriod = 'years'
      projectUpdatedFilters.some(filter => {
        if (filter.value) {
          momentNumber = filter.momentNumber
          momentPeriod = filter.momentPeriod
          return true
        }
      })
      const newResults = _.filter(results, function (o) {
        const objectDate = moment(o.updatedAt ? o.updatedAt : o.createdAt)
        const dateToCompare = moment().subtract(momentNumber, momentPeriod).startOf('day')
        const displayThis = objectDate.isAfter(dateToCompare)
        return _.includes(statusFilters, o.status) &&
          _.includes(typeFilters, o.projectType) &&
          _.includes(platformFilters, o.platformType) &&
          displayThis
      })
      return newResults
    },
    [results, platformFilters, projectUpdatedFilters, typeFilters, statusFilters]
  )

  if (networkStatus !== 8 && networkStatus !== 7) {
    return (
      <div className='animated fadeIn'>
        <Card className='card-accent-danger'>
          <Card.Header>
            <i className='fa fa-camera' />Projects
          </Card.Header>
          <Card.Body>
            <Components.Loading />
          </Card.Body>
        </Card>
      </div>
    )
  }

  return (
    <div className='animated fadeIn'>
      <Components.HeadTags title='V8: Projects' />
      {state.project &&
        <Modal show={state.show} onHide={handleHide}>
          <Modal.Header closeButton>
            <Modal.Title>
              <Link to={`/projects/${state.project._id}/${state.project.slug}`}>{state.project.projectTitle}</Link>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Components.ProjectModal document={state.project} />
          </Modal.Body>
        </Modal>}
      <Card className='card-accent-danger'>
        <Card.Header>
          <i className='fa fa-camera' />Projects
          <Components.ProjectFilters />
        </Card.Header>
        <Card.Body>
          <BootstrapTable
            bordered={false}
            condensed
            data={memoizedValue}
            hover
            keyField='_id'
            options={{
              ...state.options,
              sortIndicator: true,
              paginationSize: 5,
              hidePageListOnlyOnePage: true,
              prePage: '‹',
              nextPage: '›',
              firstPage: '«',
              lastPage: '»',
              paginationShowsTotal: renderShowsTotal,
              paginationPosition: 'both',
              clearSearch: true,
              clearSearchBtn: createCustomClearButton,
              searchField: createCustomSearchField,
              onPageChange: pageChangeHandler,
              onRowClick: rowClickHandler,
              onSizePerPageList: sizePerPageListHandler,
              onSortChange: sortChangeHandler,
              onSearchChange: searchChangeHandler,
              sizePerPageList: SIZE_PER_PAGE_LIST_SEED.concat([{
                text: 'All', value: props.totalCount
              }])
            }}
            pagination
            search
            striped
            version='4'
          >
            <TableHeaderColumn
              dataField='projectTitle'
              dataSort
              dataFormat={(cell, row) => {
                return (
                  <Link to={`/projects/${row._id}/${row.slug}`}>
                    {cell}
                  </Link>
                )
              }}
              sortFunc={titleSortFunc}
              width='25%'
            >
              Name
            </TableHeaderColumn>
            <TableHeaderColumn dataField='casting' dataSort>Casting</TableHeaderColumn>
            <TableHeaderColumn dataField='network' dataSort>Network</TableHeaderColumn>
            <TableHeaderColumn dataField='projectType' dataSort>Type</TableHeaderColumn>
            <TableHeaderColumn dataField='status' dataSort width='94px'>Status</TableHeaderColumn>
            <TableHeaderColumn dataField='updatedAt' dataSort dataFormat={dateFormatter} dataAlign='right' width='94px'>Updated</TableHeaderColumn>
            <TableHeaderColumn dataField='summary' hidden>Hidden</TableHeaderColumn>
            <TableHeaderColumn dataField='notes' hidden>Hidden</TableHeaderColumn>
            <TableHeaderColumn dataField='allContactNames' hidden>Hidden</TableHeaderColumn>
            <TableHeaderColumn dataField='allAddresses' hidden>Hidden</TableHeaderColumn>
          </BootstrapTable>
        </Card.Body>
        {hasMore &&
          <Card.Footer>
            {loadingMore
              ? <Components.Loading />
              : <Button onClick={e => { e.preventDefault(); loadMore() }}>Load More ({count}/{totalCount})</Button>}
          </Card.Footer>}
        {Users.canCreate({ collection: Projects, user: currentUser }) && <AddButtonFooter />}
      </Card>
    </div>
  )
}

const accessOptions = {
  groups: ['participants', 'admins'],
  redirect: '/welcome/new'
}

const multiOptions = {
  collection: Projects,
  fragmentName: 'ProjectsDataTableFragment',
  limit: 1000
}

registerComponent({
  name: 'ProjectsDataTable',
  component: ProjectsDataTable,
  hocs: [
    [withAccess, accessOptions],
    withCurrentUser,
    withFilters,
    [withMulti, multiOptions]
  ]
})
