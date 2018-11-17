import { Components, registerComponent, withCurrentUser, withDocument } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import { Link } from 'react-router'
import { Button, Card, CardBody, CardFooter, CardHeader, CardLink, CardText } from 'reactstrap'
import mapProps from 'recompose/mapProps'
import moment from 'moment'
import { DATE_FORMAT_LONG } from '../../modules/constants.js'
import { dangerouslyCreateAddress } from '../../modules/helpers.js'
import Offices from '../../modules/offices/collection.js'

class OfficesSingle extends PureComponent {
  render () {
    if (this.props.loading) {
      return (<div><Components.Loading /></div>)
    }

    if (!this.props.document) {
      return (<div><Components.FormattedMessage id='app.404' /></div>)
    }

    const office = this.props.document
    const displayDate = office.updatedAt
      ? 'Last modified ' + moment(office.updatedAt).format(DATE_FORMAT_LONG)
      : 'Created ' + moment(office.createdAt).format(DATE_FORMAT_LONG)

    return (
      <div className='animated fadeIn'>
        <Components.HeadTags title={`V8 Alba: ${office.displayName}`} />
        <Card className='card-accent-primary'>
          <CardHeader tag='h2'>{ office.displayName }{ Offices.options.mutations.edit.check(this.props.currentUser, office)
            ? <div className='float-right'>
              <Button tag={Link} to={`/offices/${office._id}/edit`}>Edit</Button>
            </div> : null}
          </CardHeader>
          <CardBody>
            <CardText dangerouslySetInnerHTML={dangerouslyCreateAddress(office)} />
          </CardBody>
          <CardBody>
            {office.addresses &&
              office.addresses.map((o, index) => <Components.AddressDetail key={index} address={o} />)
            }
          </CardBody>
          <CardBody>
            <CardText className='mb-1'>{ office.body }</CardText>
          </CardBody>
          <CardBody>
            {office.contacts &&
            office.contacts.map(o => <Components.ContactDetail key={o.contactId} contact={o} />)
            }
          </CardBody>
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
          <CardFooter>{displayDate}</CardFooter>
        </Card>
      </div>
    )
  }
}

const options = {
  collection: Offices,
  queryName: 'officesSingleQuery',
  fragmentName: 'OfficesSingleFragment'
}

const mapPropsFunction = props => ({ ...props, documentId: props.params._id, slug: props.params.slug })

registerComponent('OfficesSingle', OfficesSingle, withCurrentUser, mapProps(mapPropsFunction), [withDocument, options])
