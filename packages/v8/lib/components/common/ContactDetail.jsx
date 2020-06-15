import { registerComponent } from 'meteor/vulcan:core'
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Card from 'react-bootstrap/Card'

const ContactDetail = (props) => {
  const contact = props.contact
  return (
    <Card.Text className='mb-0'>
      {contact.contactTitle} <b><Link to={`/contacts/${contact.contactId}`}>{contact.contactName}</Link></b>
    </Card.Text>
  )
}

ContactDetail.propTypes = {
  contact: PropTypes.shape({
    contactId: PropTypes.string.isRequired,
    contactName: PropTypes.string.isRequired,
    contactTitle: PropTypes.string
  })
}

registerComponent('ContactDetail', ContactDetail)

export default ContactDetail
