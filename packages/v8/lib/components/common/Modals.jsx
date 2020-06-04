import { registerComponent, Components } from 'meteor/vulcan:core'
import React from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

const Modals = () => {
  return (
    <div className='animated fadeIn'>
      <Card>
        <Card.Header>
          <i className='fa fa-align-justify' /> ModalTrigger
        </Card.Header>
        <Card.Body>
          <Components.ModalTrigger title='Where is the title?' component={<Button>Launch it with a Button</Button>}>
            <Components.ContactsEditForm documentId='gnsAikqtq3iLecYNg' />
          </Components.ModalTrigger>
        </Card.Body>
      </Card>
      <Components.Loading />
    </div>
  )
}

registerComponent('Modals', Modals)
