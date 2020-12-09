import { registerComponent } from 'meteor/vulcan:core'
import React from 'react'
import Button from 'react-bootstrap/Button'
import PropTypes from 'prop-types'
import find from 'lodash/find'
import { COREUI_BRANDS_LIST, BRANDS_ENUM } from '../../modules/constants.js'

const buttonClass = (platform) => {
  return `btn-${platform} btn-brand mr-1 mb-1`
}

const iconClass = (platform) => {
  const theirBrand = COREUI_BRANDS_LIST.indexOf(platform)
  if (theirBrand > -1) {
    return 'fab fa-' + platform
  }
  const brand = find(BRANDS_ENUM, { brand: platform })
  if (brand) {
    return brand.fa
  }
  return 'fas fa-external-link'
}

const LinkDetail = (props) => {
  const { link } = props
  let platform = link.platformName.toLowerCase()
  platform = platform.replace(/\s+/g, '')
  const btn = buttonClass(platform)
  const icon = iconClass(platform)

  return (
    <Button className={btn}>
      <i className={icon} />
      <span>
        <a href={link.profileLink} target='profilelinks' data-cy='profile-link'>
          {link.profileName}
        </a>
      </span>
    </Button>
  )
}

LinkDetail.propTypes = {
  link: PropTypes.shape({
    platformName: PropTypes.string.isRequired,
    profileName: PropTypes.string.isRequired,
    profileLink: PropTypes.string.isRequired
  }).isRequired
}

registerComponent('LinkDetail', LinkDetail)

export default LinkDetail
