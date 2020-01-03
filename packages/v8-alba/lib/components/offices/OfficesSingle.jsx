import { Components, registerComponent, withCurrentUser, withSingle } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardFooter, CardHeader, CardText, CardTitle, Collapse, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
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
      <CardBody>
        <CardTitle>Past Projects</CardTitle>
        {props.pastProjects.map((o, index) => <Components.PastProjectMini key={`PastProjectMini${index}`} documentId={o.projectId} />)}
      </CardBody>
    </Card>
  )
}

class OfficesSingle extends PureComponent {
  constructor (props) {
    super(props)
    this.toggleCollapse = this.toggleCollapse.bind(this)
    this.toggleTab = this.toggleTab.bind(this)
    this.state = {
      activeTab: 'Main',
      collapseIsOpen: false
    }
  }

  toggleCollapse () {
    this.setState({ collapseIsOpen: !this.state.collapseIsOpen })
  }

  toggleTab (tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      })
    }
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
          <CardHeader tag='h2'>{ office.displayName }{ Users.canUpdate({ collection: Offices, user: currentUser, document })
            ? <div className='float-right'>
              <Button tag={Link} to={`/offices/${office._id}/edit`}>Edit</Button>
            </div> : null}
          </CardHeader>
          <CardBody>
            <Nav tabs>
              <NavItem>
                <NavLink active={this.state.activeTab === 'Main'}
                  onClick={() => { this.toggleTab('Main') }}
                >Main</NavLink>
              </NavItem>
              <NavItem>
                <NavLink active={this.state.activeTab === 'Comments'}
                  onClick={() => { this.toggleTab('Comments') }}
                >Comments</NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId='Main'>
                {office.addresses &&
                  <CardTitle><b>{pluralize('Address', office.addresses.length)}</b></CardTitle>}
                {office.addresses &&
                  office.addresses.map((o, index) => <Components.AddressDetail key={index} address={o} />)}
                {office.phones &&
                  office.phones.map((o, index) => <Components.PhoneDetail key={index} phone={o} />)}
                {office.htmlBody &&
                  <CardTitle className='mt-5'><b>Notes</b></CardTitle>}
                {office.htmlBody &&
                  <Interweave content={office.htmlBody} transform={transform} />}
                {office.theContacts &&
                  office.theContacts.length > 0 &&
                  <CardTitle className='mt-5'><b>Contacts</b></CardTitle>}
                    {office.theContacts &&
                      office.theContacts.length > 0 &&
                      office.theContacts.map((o, index) => <Components.ContactMini key={`ContactMini${index}`} documentId={o._id} />)}
                <Components.ErrorBoundary>
                  {office.theProjects &&
                    <CardTitle className='mt-5'><b>Projects</b></CardTitle>}
                  {office.theProjects &&
                    <Flextest>
                    {office.theProjects.map((o, index) => <Components.ProjectMini key={`ProjectMini-${index}`} documentId={o._id} />)}
                    </Flextest>
                  }
                </Components.ErrorBoundary>
                {office.links &&
                  <CardText className='mt-5'>
                    {office.links.map((link, index) =>
                      <Components.LinkDetail key={`link-detail-${index}`} link={link} />
                    )}
                  </CardText>
                }
              </TabPane>
              <TabPane tabId='Comments'>
                <Components.CommentsThread
                  terms={{ objectId: document._id, collectionName: 'Offices', view: 'Comments' }}
                />
              </TabPane>
              <TabPane tabId='History'>
                <Components.History documentId={document._id}/>
              </TabPane>
            </TabContent>
          </CardBody>
          <CardFooter>
            <small className='text-muted'>{displayDate}</small>
          </CardFooter>
        </Card>
        {office.pastProjects &&
        <div>
          <Button color='link' onClick={this.toggleCollapse}
            className='mb-3'>{`${this.state.collapseIsOpen ? 'Hide' : 'Show'} Past Projects`}</Button>
          <Collapse isOpen={this.state.collapseIsOpen}>
            <PastProjects collapseIsOpen={this.state.collapseIsOpen} pastProjects={office.pastProjects} />
          </Collapse>
        </div>
        }
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
