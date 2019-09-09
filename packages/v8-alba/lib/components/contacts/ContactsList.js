import { Components, registerComponent, withCurrentUser, withMulti } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import { Card, CardBody, CardHeader, CardLink, Collapse } from 'reactstrap'
import Contacts from '../../modules/contacts/collection.js'

class ContactsList extends PureComponent {
  constructor(props) {
    super(props)
    this.toggle = this.toggle.bind(this)
    this.state = {
      collapse: null
    }
  }

  toggle(e) {
    let event = e.target.dataset.event;
    this.setState({ collapse: this.state.collapse === Number(event) ? 0 : Number(event) });
  }

  render () {
    const { loading, loadingMore, loadMore, results = [], currentUser, count, totalCount } = this.props
    const { collapse } = this.state
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
              <div id='accordion'>
              {results.map((contact, index) =>
                <Card key={index}>
                  <CardHeader onClick={this.toggle} data-event={index}>{contact.displayName}</CardHeader>
                  <Collapse isOpen={collapse === index}>
                    <CardBody>
                      <Components.ContactModal document={contact} />
                    </CardBody>
                  </Collapse>
                </Card>
              )}
              </div>
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
  limit: 20
}

registerComponent({
  name: 'ContactsList',
  component: ContactsList,
  hocs: [
    [withMulti, options]
  ]
})
