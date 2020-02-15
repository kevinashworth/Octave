import { Components, registerComponent, withMessages } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Button, Card, CardBody, Col, Row } from 'reactstrap'

class EmailDetail extends PureComponent {
  constructor (props) {
    super(props)
    this.deleteEmail = this.deleteEmail.bind(this)
    this.emailEditSuccessCallback = this.emailEditSuccessCallback.bind(this)
  }

  deleteEmail = () => {
    if (window.confirm('Delete email?')) {
      console.log('delete!')
    }
  }

  emailEditSuccessCallback ({ handle }) {
    this.props.flash({
      id: 'users.add_email_success',
      properties: { handle },
      type: 'success'
    })
  }

  render () {
    const { handle, user } = this.props
    if (!handle) {
      return <FormattedMessage id='app.missing_document' />
    }
    return (
      <Card>
        <CardBody>
          <Row>
            <Col xs>
              <strong>{handle.address}&nbsp;</strong>
              {handle.primary && <span className='text-success'>&nbsp;(<FormattedMessage id='users.primary_email' />)&nbsp;</span> }
            </Col>
            <Col xs='flex'>
              <Button color='ghost-danger' onClick={this.deleteEmail}>
                <i className='fa fa-trash-o' />
              </Button>
            </Col>
            <Col xs='auto'>
              <Components.ModalTrigger
                component={<Button color='ghost-secondary'><i className='fa fa-pencil-square-o' /></Button>}>
                <Components.EmailEditForm handle={handle} user={user} successCallback={this.emailEditSuccessCallback} />
              </Components.ModalTrigger>
            </Col>
          </Row>
          <Row>
            <Col>
              <ul className='custom-list'>
                <li>{handle.verified
                  ? <FormattedMessage id='users.verified' />
                  : <>
                      <span className='text-warning'>
                        <strong><FormattedMessage id='users.unverified' /></strong>&nbsp;
                      </span>
                      &nbsp;
                      <a className='text-primary' onClick={this.sendVerificationEmail}>
                        <FormattedMessage id='users.verify_email' />
                      </a>
                    </>}
                </li>
                {handle.visibility &&
                  <li className='text-capitalize'>{handle.visibility}</li>}
              </ul>
            </Col>
          </Row>
        </CardBody>
      </Card>
    )
  }
}

EmailDetail.propTypes = {
  handle: PropTypes.shape({
    address: PropTypes.string.isRequired,
    primary: PropTypes.bool,
    verified: PropTypes.bool.isRequired
  })
}

registerComponent({
  name: 'EmailDetail',
  component: EmailDetail,
  hocs: [withMessages]
})
