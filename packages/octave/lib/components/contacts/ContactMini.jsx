import { registerComponent, withSingle } from 'meteor/vulcan:core'
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Card from 'react-bootstrap/Card'
import Contacts from '../../modules/contacts/collection.js'
import MyLoading from '../common/MyLoading'

const MyLoader = () => {
  return (
    <Card.Text className='card-mini'>
      <MyLoading variant='primary' />
    </Card.Text>
  )
}

const ContactMini = (props) => {
  const { document: contact } = props
  if (!contact) {
    return <MyLoader />
  }

  return (
    <Card.Text className='card-mini' data-cy='ContactMini'>
      <Link to={`/contacts/${contact._id}/${contact.slug}`} data-cy='contact-link'>
        {contact.firstName} {contact.middleName} <strong>{contact.lastName}</strong>
      </Link> ({contact.title})
    </Card.Text>
  )
}

ContactMini.propTypes = {
  documentId: PropTypes.string.isRequired
}

const options = {
  collection: Contacts,
  fragmentName: 'ContactsSingleFragment'
}

registerComponent({
  name: 'ContactMini',
  component: ContactMini,
  hocs: [
    [withSingle, options]
  ]
})

export default ContactMini
