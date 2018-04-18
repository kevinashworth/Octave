import { registerComponent, Components } from 'meteor/vulcan:core';
import React, {Component} from 'react';
import { Button, Card, CardHeader, CardBody } from 'reactstrap';

class Modals extends Component {
  render() {
    return (
      <div className="animated fadeIn">
        <Components.AccountsLoginForm />
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> ModalTrigger
          </CardHeader>
          <CardBody>
            <Components.MyModalTrigger title="This is the title" component={<Button>Launch modal with a Button</Button>}>
              <Components.ContactsEditForm/>
            </Components.MyModalTrigger>
          </CardBody>
        </Card>
      </div>
    )
  }
}

registerComponent('Modals', Modals);
