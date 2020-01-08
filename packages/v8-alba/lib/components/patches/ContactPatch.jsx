import { Components,  registerComponent } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { PureComponent, useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Button, Card, CardBody, CardFooter, CardHeader, CardText, CardTitle, Collapse } from 'reactstrap'
import * as jsonpatch from 'fast-json-patch'
import Interweave from 'interweave'
import _ from 'lodash'
import moment from 'moment'
import pluralize from 'pluralize'
var omitDeep = require('omit-deep')
// import Contacts from '../../modules/contacts/collection.js'
// import Patches from '../../modules/patches/collection.js'
import { DATE_FORMAT_LONG } from '../../modules/constants.js'
import { createdFormattedAddress, isEmptyValue, transform } from '../../modules/helpers.js'

const Contact = ({ contact }) => {
  const displayDate =
    'Contact as it was in the database before it was edited ' + moment(contact.updatedAt).format(DATE_FORMAT_LONG)
    return (
    <Card className='card-accent-warning'>
      <CardHeader tag='h2'>{ contact.fullName }</CardHeader>
      <CardBody>
        <CardText tag='div'>
          <b>{ contact.displayName }</b>
          { contact.title && <div>{contact.title}</div> }
          { contact.gender && <div>{contact.gender}</div> }
          <hr />
          {contact.htmlBody
            ? <Interweave content={contact.htmlBody} transform={transform} />
            : <div>{ contact.body }</div>
          }
        </CardText>
        {!isEmptyValue(contact.offices) &&
          <CardTitle className='mt-5'><b>{pluralize('Office', contact.offices.length)}</b></CardTitle>}
        {!isEmptyValue(contact.offices) &&
          contact.offices.map((o, index) =>
            <Components.OfficeMini key={index} documentId={o.officeId} />
          )}
        {contact.addresses &&
          contact.addresses[0] && <CardTitle className='mt-5'><b>{pluralize('Address', contact.addresses.length)}</b></CardTitle>}
        {contact.addresses &&
          contact.addresses.map((address, index) =>
            <Interweave key={`address${index}`} content={createdFormattedAddress(address)} />
          )}
        {!isEmptyValue(contact.projects) &&
          <CardTitle className='mt-5'><b>Projects</b></CardTitle>}
        {!isEmptyValue(contact.projects) &&
          contact.projects.map(project =>
            <CardText key={project.projectId}>
              <b><Link to={`/projects/${project.projectId}`}>{project.projectTitle}</Link></b>
              {project.titleForProject && ` (${project.titleForProject})`}
            </CardText>
          )}
        {contact.links &&
          <CardTitle className='mt-5'><b>Links</b></CardTitle>}
        {contact.links &&
          <CardText>
            {contact.links.map((link, index) =>
              <Components.LinkDetail key={`link-detail-${index}`} link={link} />
            )}
          </CardText>
        }
      </CardBody>
      <CardFooter>
        <span className='text-muted'>{displayDate}</span>
      </CardFooter>
    </Card>
  )
}

class ContactPatchDisplay extends PureComponent {
  constructor(props) {
    super(props)
  }

  render () {
    const { collapseIsOpen, contact, patch } = this.props
    if (!collapseIsOpen) {
      return null
    }
    if (!contact) {
      return <FormattedMessage id='app.missing_document' />
    }
    var clonedContact = _.cloneDeep(omitDeep(contact, ['__typename']))
    console.log('[ContactPatchDisplay] clonedContact:', clonedContact)

    var patchedContact = jsonpatch.applyPatch(clonedContact, patch.patch).newDocument
    console.log('[ContactPatchDisplay] patch:', patch.patch)
    console.log('[ContactPatchDisplay] patchedContact:', patchedContact)

    return <Contact contact={patchedContact} />
  }
}

ContactPatchDisplay.propTypes = {
  contact: PropTypes.object.isRequired,
}

const ContactPatch = ({ contact, patch }) => {
  if (!contact) {
    return <div>No History (ContactPatch)</div>
  } else {
    const [collapseIsOpen, toggleCollapse] = useState(false)
    const toggle = () => toggleCollapse(!collapseIsOpen)

    return (
      <div>
      <Button onClick={toggle}>Toggle {moment(patch.date).format(DATE_FORMAT_LONG)} Version</Button>
      <Collapse isOpen={collapseIsOpen}>
        <ContactPatchDisplay contact={contact} patch={patch} collapseIsOpen={collapseIsOpen} />
      </Collapse>
      </div>
    )
  }
}

ContactPatch.propTypes = {
  contact: PropTypes.object.isRequired,
}

registerComponent({
  name: 'ContactPatch',
  component: ContactPatch
})
