import { Components, registerComponent, withMessages } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Button, ButtonGroup, Card, CardBody, Col, Row } from 'reactstrap'

class EmailSingle extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      showLoading: false,
      justBeenDeleted: false
    }

    this.deleteEmail = this.deleteEmail.bind(this)
    this.emailEditSuccessCallback = this.emailEditSuccessCallback.bind(this)
    this.sendVerificationEmail = this.sendVerificationEmail.bind(this)
  }

  deleteEmail = ({ handle }) => {
    this.setState({ showLoading: true })
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
          this.setState({ showLoading: false })
          return
        }
        console.info('deleteEmail results:', results)
        this.props.flash({
          id: 'users.delete_email_success',
          properties: { handle: this.props.handle.address },
          type: 'primary'
        })
        this.setState({
          justBeenDeleted: true
       })
      })
    }
    this.setState({ showLoading: false })
  }

  emailEditSuccessCallback ({ handle }) {
    this.props.flash({
      id: 'users.add_email_success',
      properties: { handle },
      type: 'success'
    })
  }

  sendVerificationEmail (e) {
    e.preventDefault()
    this.setState({ showLoading: true })
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
        this.setState({ showLoading: false })
        return
      }
      // console.info('sendVerificationEmail results:', rmapEmailsCurrentUseresults)
      this.props.flash({
        id: 'users.verify_email_sent',
        properties: { handle: this.props.handle.address },
        type: 'primary'
      })
      this.setState({ showLoading: false })
    })
  }


  render () {
    const { handle, user } = this.props
    if (!handle) {
      return <FormattedMessage id='app.missing_document' />
    }
    if (this.state.justBeenDeleted) {
      return (
        <Card>
          <CardBody>
            <Components.Loading />
          </CardBody>
        </Card>
      )
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
                <Button color='ghost-danger' className='py-0 px-1' onClick={this.deleteEmail}>
                  <i className='fa fa-trash-o' />
                </Button>
                <Components.ModalTrigger
                component={<Button color='ghost-primary' className='py-0 px-1'><i className='fa fa-pencil-square-o' /></Button>}>
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
                      <a href='#' onClick={this.sendVerificationEmail}>
                        <FormattedMessage id='users.verify_email' />
                      </a>
                      {this.state.showLoading && <Components.Loading />}
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

EmailSingle.propTypes = {
  handle: PropTypes.shape({
    address: PropTypes.string.isRequired,
    primary: PropTypes.bool,
    verified: PropTypes.bool.isRequired
  })
}

registerComponent({
  name: 'EmailSingle',
  component: EmailSingle,
  hocs: [withMessages]
})
