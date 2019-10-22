import { Components, registerComponent, withCurrentUser, withSingle } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardFooter, CardHeader, CardLink, CardText, CardTitle, Collapse, Col, Row } from 'reactstrap'
import mapProps from 'recompose/mapProps'
import moment from 'moment'
import { DATE_FORMAT_LONG, DATE_FORMAT_SHORT } from '../../modules/constants.js'
import Offices from '../../modules/offices/collection.js'

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
    this.toggle = this.toggle.bind(this)
    this.state = { collapseIsOpen: false }
  }

  toggle () {
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
          <CardHeader tag='h2'>{ office.displayName }{ Offices.options.mutations.edit.check(currentUser, office)
            ? <div className='float-right'>
              <Button tag={Link} to={`/offices/${office._id}/edit`}>Edit</Button>
            </div> : null}
          </CardHeader>
          {office.addresses &&
            <CardBody>
              {office.addresses.map((o, index) => <Components.AddressDetail key={index} address={o} />)}
            </CardBody>
          }
          {office.htmlBody &&
            <CardBody>
              <CardText className='mb-1' dangerouslySetInnerHTML={{ __html: office.htmlBody }} />
            </CardBody>
          }
          <Row>
            <Col xs='12' lg='6'>
              {office.theContacts &&
               office.theContacts.length > 0 &&
                <CardBody>
                {office.theContacts.map((o, index) => <Components.ContactMini key={`ContactMini${index}`} documentId={o._id} />)}
                </CardBody>
              }
              <Components.ErrorBoundary>
                {office.theProjects &&
                  <CardBody>
                    <CardTitle><b>Projects</b></CardTitle>
                    {office.theProjects.map((o, index) => <Components.ProjectMini key={`ProjectMini-${index}`} documentId={o._id} />)}
                  </CardBody>
                }
              </Components.ErrorBoundary>
              {office.links &&
              <CardBody>
                <CardText>
                  {office.links.map(link =>
                    <Button className={`btn-${link.platformName.toLowerCase()} text-white`} key={link.profileLink}>
                      <span><CardLink href={link.profileLink} target='_links'>{link.profileName}</CardLink></span>
                    </Button>)}
                </CardText>
              </CardBody>
              }
            </Col>
            <Col xs='12' lg='6'>
              <CardBody>
                <Components.CommentsThread
                  terms={{ objectId: document._id, collectionName: 'Offices', view: 'Comments' }}
                />
            </CardBody>
            </Col>
          </Row>
          <CardFooter>
            <small className='text-muted'>{displayDate}</small>
          </CardFooter>
        </Card>
        {office.pastProjects &&
        <div>
          <Button color='link' onClick={this.toggle}
            style={{ marginBottom: '1rem' }}>{`${this.state.collapseIsOpen ? 'Hide' : 'Show'} Past Projects`}</Button>
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
