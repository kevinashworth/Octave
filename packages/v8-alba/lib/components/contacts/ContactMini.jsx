import { Components, registerComponent, withCurrentUser, withSingle } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { CardText } from 'reactstrap'
import Contacts from '../../modules/contacts/collection.js'

const ContactMini = (props) => {
  if (props.loading) {
    return (<div><Components.Loading /></div>)
  }
  if (!props.document) {
    return (<div><FormattedMessage id='app.404' /></div>)
  }

  const contact = props.document
  return (
    <CardText>
      <Link to={`/contacts/${contact._id}/${contact.slug}`}>
        {contact.firstName} {contact.middleName} <strong>{contact.lastName}</strong>
      </Link> ({contact.title})
    </CardText>
  )
}

ContactMini.propTypes = {
  documentId: PropTypes.string.isRequired
}

const options = {
  collection: Contacts,
  fragmentName: 'ContactsSingleFragment'
}

registerComponent('ContactMini', ContactMini, withCurrentUser, [withSingle, options])
