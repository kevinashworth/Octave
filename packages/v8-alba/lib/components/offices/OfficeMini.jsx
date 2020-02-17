import { Components, registerComponent, withCurrentUser, withSingle } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Card, CardBody, CardHeader } from 'reactstrap'
import Markup from 'interweave'
import { createdFormattedAddress } from '../../modules/helpers.js'
import Offices from '../../modules/offices/collection.js'

const OfficeMini = (props) => {
  if (props.loading) {
    return <Components.Loading />
  }
  if (!props.document || !props.documentId) {
    return (
      <Card className='card-accent-primary' style={{minWidth: '8rem', maxWidth: '18rem'}}>
        <FormattedMessage id='app.missing_document' />
      </Card>
    )
  }

  const office = props.document
  const officeName = props.officeName ? props.officeName : office.displayName

  return (
    <Card className='card-accent-primary' style={{minWidth: '8rem', maxWidth: '18rem'}}>
      <CardHeader tag='h6'><Link to={`/offices/${office._id}/${office.slug}`}>{officeName}</Link></CardHeader>
      {office.addresses && office.addresses.map(address => {
        return (
          <CardBody key={address.street1 + address.street2}>
            <Markup content={createdFormattedAddress(address)}/>
          </CardBody>
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
