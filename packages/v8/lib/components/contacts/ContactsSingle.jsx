import { Components, registerComponent, withCurrentUser, withSingle } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import mapProps from 'recompose/mapProps'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Collapse from 'react-bootstrap/Collapse'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import Interweave from 'interweave'
import moment from 'moment'
import pluralize from 'pluralize'
import { DATE_FORMAT_LONG, DATE_FORMAT_SHORT } from '../../modules/constants.js'
import { isEmptyValue, transform } from '../../modules/helpers.js'
import Contacts from '../../modules/contacts/collection.js'

// Don't fetch PastProjects unless user clicks to see them
// See https://reactjs.org/docs/conditional-rendering.html#preventing-component-from-rendering
function PastProjects (props) {
  if (!props.collapseIsOpen) {
    return null
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>Past Projects</Card.Title>
        {props.pastProjects.map((o, index) => <Components.PastProjectMini key={`PastProjectMini${index}`} documentId={o.projectId} />)}
      </Card.Body>
    </Card>
  )
}

class ContactsSingle extends Component {
  constructor (props) {
    super(props)

    this.state = {
      collapseIsOpen: false,
      commentsTabTitle: 'Comments'
    }
  }

  commentsCallback = (labelFromCommentsThread) => {
    this.setState({ commentsTabTitle: labelFromCommentsThread })
  }

  handleCollapseClick = () => {
    this.setState({ collapseIsOpen: !this.state.collapseIsOpen })
  }

  render () {
    const { currentUser, document, networkStatus } = this.props
    if (networkStatus !== 8 && networkStatus !== 7) {
      return <Components.Loading />
    } else if (!document) {
      return <FormattedMessage id='app.404' />
    } else {
      const contact = document
      const displayDate =
        'Contact added to database ' + moment(contact.createdAt).format(DATE_FORMAT_SHORT) + ' / ' +
        'Last modified ' + moment(contact.updatedAt).format(DATE_FORMAT_LONG)

      return (
        <div className='animated fadeIn'>
          <Components.HeadTags title={`V8: ${contact.fullName}`} />
          <Card className='card-accent-warning'>
            <Card.Header as='h2'>
              {contact.fullName}
              {Users.canUpdate({ collection: Contacts, user: currentUser, document }) &&
                <div className='float-right'>
                  <Button variant='secondary' href={`/contacts/${contact._id}/edit`}>Edit</Button>
                </div>}
            </Card.Header>
            <Card.Body>
              <Tabs defaultActiveKey='main' id='contacts_single_tabs'>
                <Tab eventKey='main' title='Main'>
                  <Card.Text as='div'>
                    <b>{contact.displayName}</b>
                    {contact.title && <div>{contact.title}</div>}
                    {contact.gender && <div>{contact.gender}</div>}
                    <hr />
                    {contact.htmlBody
                      ? <Interweave content={contact.htmlBody} transform={transform} />
                      : <div>{contact.body}</div>}
                  </Card.Text>
                  {!isEmptyValue(contact.offices) &&
                    <Card.Title className='mt-5'><b>{pluralize('Office', contact.offices.length)}</b></Card.Title>}
                  {!isEmptyValue(contact.offices) &&
                    contact.offices.map((o, index) =>
                      <Components.OfficeMini key={index} documentId={o.officeId} />
                    )}
                  {contact.addresses && contact.addresses.length > 0 &&
                    <Card.Title><b>{pluralize('Address', contact.addresses.length)}</b></Card.Title>}
                  {contact.addresses && contact.addresses.length > 0 &&
                      contact.addresses.map((o, index) => <Components.AddressDetail key={index} address={o} />)}
                  {!isEmptyValue(contact.projects) &&
                    <Card.Title className='mt-5'><b>Projects</b></Card.Title>}
                  {!isEmptyValue(contact.projects) &&
                    contact.projects.map((project, index) => <Components.ProjectMini key={`ProjectMini-${index}`} documentId={project.projectId} titleForProject={contact.title === project.titleForProject ? null : project.titleForProject} />
                    )}
                  {contact.links &&
                    <Card.Title className='mt-5'><b>Links</b></Card.Title>}
                  {contact.links &&
                    <Card.Text>
                      {contact.links.map((link, index) =>
                        <Components.LinkDetail key={`link-detail-${index}`} link={link} />
                      )}
                    </Card.Text>}
                </Tab>
                <Tab eventKey='comments' title={this.state.commentsTabTitle}>
                  <Components.CommentsThread
                    callbackFromSingle={this.commentsCallback}
                    terms={{ objectId: document._id, collectionName: 'Contacts', view: 'Comments' }}
                  />
                </Tab>
                <Tab eventKey='history' title='History'>
                  <Components.ContactPatchesList documentId={document._id} />
                </Tab>
              </Tabs>
            </Card.Body>
            <Card.Footer>
              <small className='text-muted'>{displayDate}</small>
            </Card.Footer>
          </Card>
          {contact.pastProjects &&
            <div>
              <Button
                className='mb-3'
                onClick={this.handleCollapseClick}
                variant='link'
              >{`${this.state.collapseIsOpen ? 'Hide' : 'Show'} Past Projects`}
              </Button>
              <Collapse isOpen={this.state.collapseIsOpen}>
                <PastProjects collapseIsOpen={this.state.collapseIsOpen} pastProjects={contact.pastProjects} />
              </Collapse>
            </div>}
        </div>
      )
    }
  }
}

ContactsSingle.propTypes = {
  documentId: PropTypes.string,
  document: PropTypes.object
}

const options = {
  collection: Contacts,
  fragmentName: 'ContactsSingleFragment'
}

const mapPropsFunction = props => ({ ...props, documentId: props.match && props.match.params._id })

registerComponent({
  name: 'ContactsSingle',
  component: ContactsSingle,
  hocs: [
    withCurrentUser,
    mapProps(mapPropsFunction), [withSingle, options] // mapProps must precede withSingle
  ]
})
