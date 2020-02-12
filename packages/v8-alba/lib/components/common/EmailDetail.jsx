import { Components, registerComponent } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, Col, Row } from 'reactstrap'

class EmailDetail extends PureComponent {
  constructor (props) {
    super(props)
  }

  render () {
    const { handle } = this.props

    if (!handle) {
      return <FormattedMessage id='app.missing_document' />
    }

    return (
      <Card>
        <CardBody>
          <Row>
            <Col>
              <strong>{handle.address}&nbsp;</strong>
              {handle.primary && <span className='text-success'>&nbsp;(<FormattedMessage id='users.primary_email' />)&nbsp;</span> }
            </Col>
            <Col className='ml-auto'>[remove/update]</Col>
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
            <Col></Col>
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
  component: EmailDetail
})
