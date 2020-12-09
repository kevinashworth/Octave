import { Components, getSetting, registerComponent } from 'meteor/vulcan:core'
import React from 'react'

const MyHeadTags = ({ title, ...rest }) => {
  const siteTitle = getSetting('title')
  let formattedTitle = title
  if (siteTitle.length > 0) {
    formattedTitle += ' | ' + siteTitle
  }
  return (
    <Components.HeadTags title={formattedTitle} {...rest} />
  )
}

registerComponent('MyHeadTags', MyHeadTags)

export default MyHeadTags
