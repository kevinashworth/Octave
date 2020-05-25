import { registerComponent } from 'meteor/vulcan:core'
import React from 'react'
import { Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import find from 'lodash/find'

let faBrandList = [
  'behance', 'css3', 'dribbble', 'dropbox', 'facebook', 'flickr', 'foursquare', 'github',
  'google-plus', 'html5', 'instagram', 'linkedin', 'openid', 'pinterest', 'reddit', 'spotify',
  'stack-overflow', 'tumblr', 'twitter', 'vimeo', 'vine', 'vk', 'xing', 'yahoo', 'youtube'
]
faBrandList.concat([
  'imdb', 'wikipedia'
])

const myBrandList = [
  {
    brand: 'cbs',
    fa: 'fa-television'
  },
  {
    brand: 'csa',
    fa: 'fa-desktop'
  },
  {
    brand: 'freeform',
    fa: 'fa-television'
  },
  {
    brand: 'hulu',
    fa: 'fa-television'
  },
  {
    brand: 'imdbpro',
    fa: 'fa-imdb'
  },
  {
    brand: 'netflix',
    fa: 'fa-television'
  },
  {
    brand: 'vudu',
    fa: 'fa-television'
  },
  {
    brand: 'website',
    fa: 'fa-desktop'
  }
]

const getPlatform = (platformName) => {
  let platform = platformName.toLowerCase()
  platform = platform.replace(/\s+/g, '')
  return platform
}
const buttonClass = (platformName) => {
  const platform = getPlatform(platformName)
  return `btn-${platform} btn-brand mr-1 mb-1`
}
const iconClass = (platformName) => {
  const platform = getPlatform(platformName)
  const theirBrand = faBrandList.indexOf(platform)
  if (theirBrand > -1) {
    return 'fa fa-' + platform
  }
  const brand = find(myBrandList, {brand: platform})
  if (brand) {
    return 'fa ' + brand.fa
  } else {
    return 'fa fa-star'
  }
}

const LinkDetail = (props) => {
  const { link } = props
  const btn = buttonClass(link.platformName)
  const icon = iconClass(link.platformName)

  return (
    <Button className={btn}>
      <i className={icon} />
      <span>
        <a href={link.profileLink} target='profilelinks'>
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
