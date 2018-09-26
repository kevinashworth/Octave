import { registerComponent } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'

class Footer extends PureComponent {
  render () {
    return (
      <footer className='app-footer'>
        <span><a href='https://placeholder.com/'>The Fourth Wall</a> &copy; 2018 SuperSecretSite.</span>
        <span className='ml-auto'>Powered by <a href='https://placeholder.com/'>4</a></span>
      </footer>
    )
  }
}

registerComponent('Footer', Footer)
