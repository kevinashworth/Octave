import { Components, registerComponent, withCurrentUser, withSingle } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Collapse from 'react-bootstrap/Collapse'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import Interweave from 'interweave'
import mapProps from 'recompose/mapProps'
import moment from 'moment'
import pluralize from 'pluralize'
import styled from 'styled-components'
import { DATE_FORMAT_LONG, DATE_FORMAT_SHORT } from '../../modules/constants.js'
import { transform } from '../../modules/helpers.js'
import Offices from '../../modules/offices/collection.js'

const Flextest = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: stretch;
align-content: flex-start;
`

// Don't fetch and render PastProjects unless user clicks to see them
// See https://reactjs.org/docs/conditional-rendering.html
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

class OfficesSingle extends Component {
  constructor (props) {
    super(props)

    this.state = {
      collapseIsOpen: false,
      commentsTabTitle: 'Comments'
    }
  }

  commentsCallback (labelFromCommentsThread) {
    this.setState({ commentsTabTitle: labelFromCommentsThread })
  }

  handleCollapseClick = () => {
    this.setState({ collapseIsOpen: !this.state.collapseIsOpen })
  }

  render () {
    const { currentUser, document, loading } = this.props
    if (loading) {
      return (<div><Components.Loading /></div>)
    }
    if (!document) {
      return (<div><FormattedMessage id='app.404' /></div>)
    }
    const office = document
    const displayDate =
      'Office added to database ' + moment(office.createdAt).format(DATE_FORMAT_SHORT) + ' / ' +
      'Last modified ' + moment(office.updatedAt).format(DATE_FORMAT_LONG)

    return (
      <div className='animated fadeIn'>
        <Components.HeadTags title={`V8 Alba: ${office.displayName}`} />
        <Card className='card-accent-primary'>
          <Card.Header as='h2'>
            {office.displayName}
            {Users.canUpdate({ collection: Offices, user: currentUser, document }) &&
              <div className='float-right'>
                <Button variant='secondary' href={`/offices/${office._id}/edit`}>Edit</Button>
              </div>}
          </Card.Header>
          <Card.Body>
            <Tabs defaultActiveKey='main' id='offices_single_tabs'>
              <Tab eventKey='main' title='Main'>
                {office.addresses &&
                  <Card.Title><b>{pluralize('Address', office.addresses.length)}</b></Card.Title>}
                {office.addresses &&
                  office.addresses.map((o, index) => <Components.AddressDetail key={index} address={o} />)}
                {office.phones &&
                  office.phones.map((o, index) => <Components.PhoneDetail key={index} phone={o} />)}
                {office.htmlBody &&
                  <Card.Title className='mt-5'><b>Notes</b></Card.Title>}
                {office.htmlBody &&
                  <Interweave content={office.htmlBody} transform={transform} />}
                {office.theContacts &&
                  office.theContacts.length > 0 &&
                    <Card.Title className='mt-5'><b>Contacts</b></Card.Title>}
                {office.theContacts &&
                  office.theContacts.length > 0 &&
                  office.theContacts.map((o, index) => <Components.ContactMini key={`ContactMini${index}`} documentId={o._id} />)}
                <Components.ErrorBoundary>
                  {office.theProjects &&
                    <Card.Title className='mt-5'><b>Projects</b></Card.Title>}
                  {office.theProjects &&
                    <Flextest>
                      {office.theProjects.map((o, index) => <Components.ProjectMini key={`ProjectMini-${index}`} documentId={o._id} />)}
                    </Flextest>}
                </Components.ErrorBoundary>
                {office.links &&
                  <Card.Text className='mt-5'>
                    {office.links.map((link, index) =>
                      <Components.LinkDetail key={`link-detail-${index}`} link={link} />
                    )}
                  </Card.Text>}
              </Tab>
              <Tab eventKey='comments' title={this.state.commentsTabTitle}>
                <Components.CommentsThread
                  callbackFromSingle={this.commentsCallback}
                  terms={{ objectId: document._id, collectionName: 'Offices', view: 'Comments' }}
                />
              </Tab>
              <Tab eventKey='history' title='History'>
                <Components.OfficePatchesList documentId={document._id} />
              </Tab>
            </Tabs>
          </Card.Body>
          <Card.Footer>
            <small className='text-muted'>{displayDate}</small>
          </Card.Footer>
        </Card>
        {office.pastProjects &&
          <div>
            <Button
              className='mb-3'
              onClick={this.handleCollapseClick}
              variant='link'
            >
              {`${this.state.collapseIsOpen ? 'Hide' : 'Show'} Past Projects`}
            </Button>
            <Collapse isOpen={this.state.collapseIsOpen}>
              <PastProjects collapseIsOpen={this.state.collapseIsOpen} pastProjects={office.pastProjects} />
            </Collapse>
          </div>}
      </div>
    )
  }
}

const options = {
  collection: Offices,
  fragmentName: 'OfficesSingleFragment'
}

const mapPropsFunction = props => ({ ...props, documentId: props.match && props.match.params._id })

registerComponent({
  name: 'OfficesSingle',
  component: OfficesSingle,
  hocs: [
    withCurrentUser,
    mapProps(mapPropsFunction), [withSingle, options] // mapProps must precede withSingle
  ]
})
