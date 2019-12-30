import { registerComponent } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { CardText } from 'reactstrap'

class PhoneDetail extends PureComponent {
  render () {
    const { phone } = this.props
    let displayText = phone.phoneNumberType ? phone.phoneNumberType + ': ' : ''
    displayText += phone.nationalFormat ? phone.nationalFormat : phone.phoneNumberAsInput
    return (
      <CardText>
        {displayText}
      </CardText>
    )
  }
}

PhoneDetail.propTypes = {
  phone: PropTypes.shape({
    phoneNumberAsInput: PropTypes.string,
    phoneNumberType: PropTypes.string,
    phoneNumber: PropTypes.string,
    nationalFormat: PropTypes.string,
  }).isRequired
}

registerComponent('PhoneDetail', PhoneDetail)
