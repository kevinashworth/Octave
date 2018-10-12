import { Components, registerComponent, withCurrentUser, withMulti } from 'meteor/vulcan:core'
import React from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink
} from 'reactstrap'
import _ from 'lodash'
import moment from 'moment'
import Contacts from '../../modules/contacts/collection.js'
import withContactFilters from '../../modules/filters/withContactFilters.js'

const ContactsTable = ({ loading, results = [], currentUser,
  contactTitleFilters, contactUpdatedFilters, contactLocationFilters }) => {
  let titleFilters = []
  contactTitleFilters.forEach(filter => {
    if (filter.value) { titleFilters.push(filter.contactTitle) }
  })
  let otherFilters = []
  contactTitleFilters.forEach(filter => {
    if (!filter.value) { otherFilters.push(filter.contactTitle) }
  })
  let locationFilters = []
  contactLocationFilters.forEach(filter => {
    if (filter.value) { locationFilters.push(filter.contactLocation) }
  })
  let moment1 = ''
  let moment2 = ''
  contactUpdatedFilters.forEach(filter => {
    if (filter.value) {
      moment1 = filter.moment1
      moment2 = filter.moment2
    }
  })

  const filteredResults = _.filter(results, function (o) {
    // compare current time to filter, but generous, so start of day then, not the time it is now - filter plus up to 23:59
    const now = moment()
    const dateToCompare = o.updatedAt ? o.updatedAt : o.createdAt
    const displayThis = moment(dateToCompare).isAfter(now.subtract(moment1, moment2).startOf('day'))

    // if "Other" is not checked, filter per normal via titleFilters:
    if (!(_.includes(titleFilters, 'Other'))) {
      return _.includes(locationFilters, o.location) &&
          _.includes(titleFilters, o.title) &&
          displayThis
    } else { // if "Other" is checked, eliminate based on titles in contactTitleFilters
      return _.includes(locationFilters, o.location) &&
        !_.includes(otherFilters, o.title) &&
        displayThis
    }
  })

  return (
    <div className='animated fadeIn'>
      <Components.AccountsLoginForm />
      <Card>
        <CardHeader>
          <i className='fa fa-align-justify' /> ContactsTable
          <Components.ContactFilters />
        </CardHeader>
        { loading
          ? <CardBody>
            <Components.Loading />
          </CardBody>
          : <CardBody>
            <Table hover bordered striped responsive size='sm'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Address</th>
                  <th>(cont)</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Zip</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map(contact => <Components.ContactsRow key={contact._id} documentId={contact._id} currentUser={currentUser} />)}
              </tbody>
            </Table>
            <nav>
              <Pagination>
                <PaginationItem><PaginationLink previous href='#'>Prev</PaginationLink></PaginationItem>
                <PaginationItem active>
                  <PaginationLink href='#'>1</PaginationLink>
                </PaginationItem>
                <PaginationItem><PaginationLink href='#'>2</PaginationLink></PaginationItem>
                <PaginationItem><PaginationLink href='#'>3</PaginationLink></PaginationItem>
                <PaginationItem><PaginationLink href='#'>4</PaginationLink></PaginationItem>
                <PaginationItem><PaginationLink next href='#'>Next</PaginationLink></PaginationItem>
              </Pagination>
            </nav>
          </CardBody>
        }
      </Card>
      <Components.ContactsNewForm />
    </div>
  )
}

const options = {
  collection: Contacts,
  fragmentName: 'ContactsSingleFragment',
  limit: 100,
  enableCache: true
}

registerComponent('ContactsTable', ContactsTable, withContactFilters, withCurrentUser, [withMulti, options])
