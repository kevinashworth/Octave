import { Components, replaceComponent } from 'meteor/vulcan:core'
import React from 'react'
import { Card, CardBody, Form } from 'reactstrap';

export class MyAccountsLoginForm extends React.Component {
  render() {
    return (
      <Card>
        <CardBody>
          <Form>
            <h1>Sign In / Sign Up</h1>
            <p className="text-muted">Access your V8 account</p>
            <Components.AccountsStateSwitcher {...this.props} />
          </Form>
        </CardBody>
      </Card>
    )
  }
}

replaceComponent('AccountsLoginForm', MyAccountsLoginForm)
