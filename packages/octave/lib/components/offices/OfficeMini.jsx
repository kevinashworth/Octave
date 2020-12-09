import { Components, registerComponent, withSingle } from 'meteor/vulcan:core'
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Card from 'react-bootstrap/Card'
import Offices from '../../modules/offices/collection.js'
import MyLoading from '../common/MyLoading'

const MyLoader = () => {
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
  const { document: office } = props
  if (!office) {
    return <MyLoader />
  }

  return (
    <Card className='card-accent-offices card-mini' data-cy='OfficeMini'>
      <Card.Header as='h6'>
        <Link to={`/offices/${office._id}/${office.slug}`} data-cy='office-link'>
          {office.displayName}
        </Link>
      </Card.Header>
      {office.addresses && office.addresses.map(address => (
        <Card.Body key={address.street1 + address.street2}>
          <Components.AddressDetail address={address} />
        </Card.Body>
      ))}
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

registerComponent({
  name: 'OfficeMini',
  component: OfficeMini,
  hocs: [
    [withSingle, options]
  ]
})

export default OfficeMini
