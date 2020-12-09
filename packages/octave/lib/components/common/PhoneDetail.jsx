import { registerComponent } from 'meteor/vulcan:core'
import React from 'react'
import PropTypes from 'prop-types'
import Card from 'react-bootstrap/Card'

const PhoneDetail = ({ phone }) => {
  const label = phone.phoneNumberType ? phone.phoneNumberType + ': ' : ''
  const number = phone.nationalFormat ? phone.nationalFormat : phone.phoneNumberAsInput
  const title = phone.countryCode ? `Country Code '${phone.countryCode}'` : null
  return (
    <Card.Text>
      {label}
      <a title={title} href={`tel:${phone.phoneNumber}`}>{number}</a>
    </Card.Text>
  )
}

PhoneDetail.propTypes = {
  phone: PropTypes.shape({
    phoneNumberAsInput: PropTypes.string,
    phoneNumberType: PropTypes.string,
    phoneNumber: PropTypes.string,
    nationalFormat: PropTypes.string,
    countryCode: PropTypes.string
  }).isRequired
}

registerComponent('PhoneDetail', PhoneDetail)

export default PhoneDetail
