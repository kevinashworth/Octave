import { Components, registerComponent } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Button, Card, CardBody } from 'reactstrap'

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
          <strong>{handle.address}&nbsp;</strong>
          {handle.primary && <span className='text-success'>&nbsp;(<FormattedMessage id='users.primary_email' />)&nbsp;</span> }
          {(handle.address && handle.verified)
            ? <span className='badge badge-success'><FormattedMessage id='users.verified' /></span>
            : <>
                <span className='badge badge-warning'><FormattedMessage id='users.unverified' /></span>
                <Button size='sm' color='link' onClick={this.sendVerificationEmail}>
                  <FormattedMessage id='users.verify_email' />
                </Button>
              </>}
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
