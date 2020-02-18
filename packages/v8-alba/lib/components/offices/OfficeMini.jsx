import { Components, registerComponent, withCurrentUser, withSingle } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Card, CardBody, CardHeader } from 'reactstrap'
import Markup from 'interweave'
import { createdFormattedAddress } from '../../modules/helpers.js'
import Offices from '../../modules/offices/collection.js'

class OfficeMini extends PureComponent {
  render () {
    const { document: office, documentId, loading, officeName } = this.props

    if (loading) {
      return <Components.Loading />
    }
    if (!document || !documentId) {
      return (
        <Card className='card-accent-primary' style={{minWidth: '8rem', maxWidth: '18rem'}}>
          <FormattedMessage id='app.missing_document' />
        </Card>
      )
    }
    return (
      <Card className='card-accent-primary' style={{minWidth: '8rem', maxWidth: '18rem'}}>
        <CardHeader tag='h6'>
          <Link to={`/offices/${office._id}/${office.slug}`}>
            {officeName ? officeName : office.displayName}
          </Link>
        </CardHeader>
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
}

OfficeMini.propTypes = {
  documentId: PropTypes.string.isRequired
}

const options = {
  collection: Offices,
  fragmentName: 'OfficesSingleFragment'
}

registerComponent('OfficeMini', OfficeMini, withCurrentUser, [withSingle, options])
