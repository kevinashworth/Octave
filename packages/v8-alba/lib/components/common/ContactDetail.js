import { registerComponent } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { CardText } from 'reactstrap'

class ContactDetail extends PureComponent {
  render () {
    const contact = this.props.contact
    return (
      <CardText className='mb-0'>
        {contact.contactTitle} <b><Link to={`/contacts/${contact.contactId}`}>{contact.contactName}</Link></b>
      </CardText>
    )
  }
}

ContactDetail.propTypes = {
  contact: PropTypes.shape({
    contactId: PropTypes.string.isRequired,
    contactName: PropTypes.string.isRequired,
    contactTitle: PropTypes.string
  })
}

registerComponent('ContactDetail', ContactDetail)
