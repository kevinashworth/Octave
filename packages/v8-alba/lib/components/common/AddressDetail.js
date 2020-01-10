import { registerComponent } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { CardText } from 'reactstrap'

class AddressDetail extends PureComponent {
  render () {
    const { address } = this.props
    const addressLabel = address.addressType ? address.addressType + ' Address' : null
    var showMap = false
    var mapSearchString = 'https://maps.google.com/?q='
    if (address.street1) {
      showMap = true
      mapSearchString += address.street1
      if (address.city) {
        mapSearchString += (',' + address.city)
      }
      if (address.state) {
        mapSearchString += (',' + address.state)
      }
    }

    return (
      <CardText>
        {addressLabel &&
          <span><b>{ addressLabel }</b><br /></span>
        }
        {address.street1 &&
          <span>{ address.street1 }<br /></span>
        }
        {address.street2 &&
          <span>{ address.street2 }<br /></span>
        }
        {(address.city || address.state || address.zip) &&
          <span>{ address.city } { address.state } { address.zip }<br /></span>
        }
        {showMap &&
          <small><a href={mapSearchString} target='googlemaps'>Open in Google Maps</a></small>
        }
      </CardText>
    )
  }
}

AddressDetail.propTypes = {
  address: PropTypes.shape({
    street1: PropTypes.string,
    street2: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    zip: PropTypes.string,
    location: PropTypes. string,
    addressType: PropTypes. string
  }).isRequired
}

registerComponent('AddressDetail', AddressDetail)
