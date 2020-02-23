import { Components, registerComponent, withMessages } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Button, ButtonGroup, Card, CardBody, Col, Row } from 'reactstrap'

class EmailDetail extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      loading: false
    }

    this.deleteEmail = this.deleteEmail.bind(this)
    this.emailEditSuccessCallback = this.emailEditSuccessCallback.bind(this)
    this.sendVerificationEmail = this.sendVerificationEmail.bind(this)
  }

  deleteEmail = ({ handle }) => {
    this.setState({ loading: true })
    if (window.confirm('Delete email?')) {
      Meteor.call(
        'removeEmail',
        {
          userId: this.props.user._id,
          email: this.props.handle.address
        },
        (error, results) => {
        if (error) {
          console.error('deleteEmail error:', error)
          this.props.flash(error.reason, 'error')
          this.setState({ loading: false })
          return
        }
        console.info('deleteEmail results:', results)
        this.props.flash({
          id: 'users.delete_email_success',
          properties: { handle: this.props.handle.address },
          type: 'primary'
        })
        this.setState({ loading: false })
      })
    }
  }

  emailEditSuccessCallback ({ handle }) {
    this.props.flash({
      id: 'users.add_email_success',
      properties: { handle },
      type: 'success'
    })
  }

  sendVerificationEmail () {
    this.setState({ loading: true })
    Meteor.call(
      'sendVerificationEmail',
      {
        userId: this.props.user._id,
        email: this.props.handle.address
      },
      (error, results) => {
      if (error) {
        console.error('sendVerificationEmail error:', error)
        this.props.flash(error.reason, 'error')
        this.setState({ loading: false })
        return
      }
      // console.info('sendVerificationEmail results:', rmapEmailsCurrentUseresults)
      this.props.flash({
        id: 'users.verify_email_sent',
        properties: { handle: this.props.handle.address },
        type: 'primary'
      })
      this.setState({ loading: false })
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
            <Col xs='auto'>
              <ButtonGroup>
                <Button color='ghost-danger' onClick={this.deleteEmail}>
                  <i className='fa fa-trash-o' />
                </Button>
                <Components.ModalTrigger
                component={<Button color='ghost-secondary'><i className='fa fa-pencil-square-o' /></Button>}>
                  <Components.EmailEditForm handle={handle} user={user} successCallback={this.emailEditSuccessCallback} />
                </Components.ModalTrigger>
              </ButtonGroup>
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
                      <Button color='link' onClick={this.sendVerificationEmail}>
                        <FormattedMessage id='users.verify_email' />
                      </Button>
                      {this.state.loading && <Components.Loading />}
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
