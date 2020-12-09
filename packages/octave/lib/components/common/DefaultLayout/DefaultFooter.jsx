import { getSetting } from 'meteor/vulcan:core'
import React from 'react'

const DefaultFooter = () => {
  return (
    <>
      <span><a href={getSetting('homeUrl', '/')}>{getSetting('title', 'Octave')}</a> &copy; 2020 {getSetting('owner', 'SuperSite, LLC')}</span>
      <span className='ml-auto'>Powered by <a href={getSetting('ownerUrl', '//example.com')}>{getSetting('tagline', 'You')}</a></span>
    </>
  )
}

export default DefaultFooter
