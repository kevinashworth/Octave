import { registerComponent } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Button, CardLink } from 'reactstrap'

class LinkDetail extends PureComponent {
  render () {
    const { link } = this.props
    return (

      <Button className={`btn-${link.platformName.toLowerCase()} text-white`} key={link.profileLink}>
        <span><CardLink href={link.profileLink} target='profilelinks'>{link.profileName}</CardLink></span>
      </Button>

    )
  }
}

LinkDetail.propTypes = {
  link: PropTypes.shape({
    platformName: PropTypes.string.isRequired,
    profileName: PropTypes.string.isRequired,
    profileLink: PropTypes.string.isRequired
  }).isRequired
}

registerComponent('LinkDetail', LinkDetail)
