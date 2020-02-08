import { registerComponent, Components } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import { Button, Card, CardHeader, CardBody } from 'reactstrap'

class Modals extends PureComponent {
  render () {
    return (
      <div className='animated fadeIn'>
        <Card>
          <CardHeader>
            <i className='fa fa-align-justify' /> ModalTrigger
          </CardHeader>
          <CardBody>
            <Components.ModalTrigger title='Where is the title?' component={<Button>Launch it with a Button</Button>}>
              <Components.ContactsEditForm documentId='gnsAikqtq3iLecYNg' />
            </Components.ModalTrigger>
          </CardBody>
        </Card>
        <Components.Loading />
      </div>
    )
  }
}

registerComponent('Modals', Modals)
