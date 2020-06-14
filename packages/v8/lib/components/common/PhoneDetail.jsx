import { registerComponent } from 'meteor/vulcan:core'
import React from 'react'
import PropTypes from 'prop-types'
import Card from 'react-bootstrap/Card'

const PhoneDetail = (props) => {
  const { phone } = props
  let displayText = phone.phoneNumberType ? phone.phoneNumberType + ': ' : ''
  displayText += phone.nationalFormat ? phone.nationalFormat : phone.phoneNumberAsInput
  return (
    <Card.Text>
      {displayText}
    </Card.Text>
  )
}

PhoneDetail.propTypes = {
  phone: PropTypes.shape({
    phoneNumberAsInput: PropTypes.string,
    phoneNumberType: PropTypes.string,
    phoneNumber: PropTypes.string,
    nationalFormat: PropTypes.string
  }).isRequired
}

registerComponent('PhoneDetail', PhoneDetail)

export default PhoneDetail
