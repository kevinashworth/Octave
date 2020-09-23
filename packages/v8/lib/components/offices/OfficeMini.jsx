import { Components, registerComponent, withCurrentUser, withSingle } from 'meteor/vulcan:core'
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Card from 'react-bootstrap/Card'
import Offices from '../../modules/offices/collection.js'
import MyLoading from '../common/MyLoading'

const MyLoader = ({ cardClass }) => {
  return (
    <Card className='card-accent-offices card-mini'>
      <Card.Header as='h6'>
        <MyLoading variant='primary' />
      </Card.Header>
      <Card.Body>
        <MyLoading height={63} />
      </Card.Body>
    </Card>
  )
}

const OfficeMini = (props) => {
  if (!props.document) {
    return <MyLoader />
  }

  const office = props.document
  return (
    <Card className='card-accent-offices card-mini'>
      <Card.Header as='h6'>
        <Link to={`/offices/${office._id}/${office.slug}`}>
          {office.displayName}
        </Link>
      </Card.Header>
      {office.addresses && office.addresses.map(address => {
        return (
          <Card.Body key={address.street1 + address.street2}>
            <Components.AddressDetail address={address} />
          </Card.Body>
        )
      })}
    </Card>
  )
}

OfficeMini.propTypes = {
  documentId: PropTypes.string.isRequired
}

const options = {
  collection: Offices,
  fragmentName: 'OfficesSingleFragment'
}

registerComponent('OfficeMini', OfficeMini, withCurrentUser, [withSingle, options])

export default OfficeMini
