import { Components, registerComponent, withMulti } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardBody, CardFooter, CardHeader, CardText, CardTitle, Collapse } from 'reactstrap'
import Markup from 'interweave'
import Contacts from '../../modules/contacts/collection.js'
import moment from 'moment'
import { DATE_FORMAT_SHORT } from '../../modules/constants.js'
import { createdFormattedAddress, isEmptyValue } from '../../modules/helpers.js'

const ContactForMobile = (props) => {
  if (props.loading) {
    return (<div><Components.Loading /></div>)
  }

  if (!props.document) {
    return (<div><FormattedMessage id='app.404' /></div>)
  }

  const contact = props.document
  const displayDate =
      'Last modified ' + moment(contact.updatedAt).format(DATE_FORMAT_SHORT)

  return (
    <div>
      <Card className='card-accent-warning'>
        <CardBody>
          <CardText tag='div'>
            { contact.title && <div>{contact.title}</div> }
            { contact.gender && <div>{contact.gender}</div> }
            {(contact.htmlBody || contact.body)
              ? <hr />
              : null
            }
            {contact.htmlBody
              ? <Markup content={contact.htmlBody } />
              : <div>{ contact.body }</div>
            }
          </CardText>
        </CardBody>
        {!isEmptyValue(contact.addresses) &&
        <CardBody>
          {contact.addresses[1] && <CardTitle>Addresses</CardTitle>}
          {contact.addresses.map((address, index) =>
            <Markup key={`address${index}`} content={createdFormattedAddress(address)} />
          )}
        </CardBody>
        }
        {contact.projects &&
        <CardBody>
          <CardTitle>Projects</CardTitle>
          {contact.projects.map(project =>
            <CardText key={project.projectId}>
              <b><Link to={`/projects/${project.projectId}`}>{project.projectTitle}</Link></b>
              {project.titleForProject && ` (${project.titleForProject})`}
            </CardText>
          )}
        </CardBody>
        }
        <CardFooter>
          <small className='text-muted'>{displayDate}</small>
        </CardFooter>
      </Card>
    </div>
  )
}

class ContactsList extends PureComponent {
  constructor (props) {
    super(props)
    this.toggle = this.toggle.bind(this)
    this.state = {
      isOpen: -1
    }
  }

  toggle (e) {
    const event = e.target.dataset.event
    this.setState({ isOpen: this.state.isOpen === Number(event) ? -1 : Number(event) })
  }

  render () {
    const { loading, results = [] } = this.props
    if (loading) {
      return <Components.Loading />
    } else {
      return (
        <div className='animated fadeIn'>
          <Card>
            <CardHeader>
              <i className='icon-people' />Contacts for Mobile
            </CardHeader>
            <CardBody>
              {results.map((contact, index) =>
                <Card key={index}>
                  <CardHeader onClick={this.toggle} data-event={index}>{contact.displayName}</CardHeader>
                  <Collapse isOpen={this.state.isOpen === index}>
                    <CardBody>
                      <ContactForMobile document={contact} />
                    </CardBody>
                  </Collapse>
                </Card>
              )}
            </CardBody>
          </Card>
        </div>
      )
    }
  }
}

const options = {
  collection: Contacts,
  fragmentName: 'ContactsSingleFragment',
  limit: 500,
  terms: { view: 'contactsByLastName' }
}

registerComponent({
  name: 'ContactsList',
  component: ContactsList,
  hocs: [
    [withMulti, options]
  ]
})
