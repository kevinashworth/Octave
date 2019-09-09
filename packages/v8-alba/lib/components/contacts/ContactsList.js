import { Components, registerComponent, withCurrentUser, withMulti } from 'meteor/vulcan:core'
import React from 'react'
import { Button, Card, CardBody, CardHeader, UncontrolledCollapse } from 'reactstrap'
import Contacts from '../../modules/contacts/collection.js'

const ContactsList = ({ loading, loadingMore, loadMore, results = [], currentUser, count, totalCount }) => {
  if (loading) {
    return <Components.Loading />
  } else {
  return (
    <div className='animated fadeIn' >
      <Card >
        <CardHeader>
          <i className='icon-briefcase'/> Contacts for Mobile
        </CardHeader>
        <CardBody>
        {results.map(contact =>
          <div key={contact._id}>
            <Button id={contact.slug}>
              {contact.displayName}
            </Button>
            <UncontrolledCollapse toggler={`#${contact.slug}`}>
              <Card>
                <CardBody>
                  { contact.title && <div>{contact.title}</div> }
                  { contact.gender && <div>{contact.gender}</div> }
                  <hr />
                  {contact.htmlBody
                    ? <div dangerouslySetInnerHTML={{ __html: contact.htmlBody }} />
                    : <div>{ contact.body }</div>
                  }
                </CardBody>
              </Card>
            </UncontrolledCollapse>
          </div>
        )}
        </CardBody>
      </Card>
    </div>
  )}
}

const options = {
  collection: Contacts,
  fragmentName: 'ContactsSingleFragment',
  limit: 5
}

registerComponent('ContactsList', ContactsList, withCurrentUser, [withMulti, options])
