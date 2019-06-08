import { registerComponent, withCurrentUser, withDocument } from 'meteor/vulcan:core'
import React from 'react'
import { Link } from 'react-router-dom'
import { Badge, ListGroupItem } from 'reactstrap'
import moment from 'moment'
import { DATE_FORMAT_SHORT } from '../../modules/constants.js'
import Offices from '../../modules/offices/collection.js'

const OfficesItem = ({ loading, document, currentUser }) => {
  if (loading) {
    return (
      null
    )
  } else {
    const office = document
    const badge = office.projects ? office.projects.length : null
    const displayDate = office.updatedAt
      ? 'Last modified ' + moment(office.updatedAt).format(DATE_FORMAT_SHORT)
      : 'Created ' + moment(office.createdAt).format(DATE_FORMAT_SHORT)

    return (
      <ListGroupItem action>
        <Link to={`/offices/${office._id}/${office.slug}`}>{office.displayName}</Link>
        &nbsp; <Badge color='success' pill>{badge}</Badge>
        &nbsp; <small>{displayDate}</small>
      </ListGroupItem>
    )
  }
}

const options = {
  collection: Offices,
  queryName: 'officesSingleQuery',
  fragmentName: 'OfficesSingleFragment'
}

registerComponent('OfficesItem', OfficesItem, withCurrentUser, [withDocument, options])