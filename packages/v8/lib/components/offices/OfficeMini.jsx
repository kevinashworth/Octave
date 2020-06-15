import { Components, registerComponent, withCurrentUser, withSingle } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Card from 'react-bootstrap/Card'
import Offices from '../../modules/offices/collection.js'

const OfficeMini = (props) => {
  const { document: office, documentId, loading } = props
  if (loading) {
    return <Components.Loading />
  }
  if (!document || !documentId) {
    return (
      <Card className='card-accent-primary' style={{ minWidth: '8rem', maxWidth: '18rem' }}>
        <FormattedMessage id='app.missing_document' />
      </Card>
    )
  }
  return (
    <Card className='card-accent-primary' style={{ minWidth: '8rem', maxWidth: '18rem' }}>
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
