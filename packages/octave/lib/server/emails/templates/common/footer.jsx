import { getSetting } from 'meteor/vulcan:core'
import React from 'react'

export const footer = () => {
  return (
    <span>
      <a href='//octave.the-4th-wall.com/'>{getSetting('title', 'Octave')}</a> &copy; 2020 SuperSite, LLC<br />
      Powered by <a href='//the-4th-wall.com/'>{getSetting('tagline', 'The 4th Wall')}</a>
    </span>
  )
}
