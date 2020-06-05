import { registerComponent } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'

class ErrorBoundary extends PureComponent {
  constructor (props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError () {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch (error, info) {
    // You can also log the error to an error reporting service
    console.info('ErrorBoundary:', error, info)
  }

  render () {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h4>Something went wrong.</h4>
    }

    return this.props.children
  }
}

registerComponent('ErrorBoundary', ErrorBoundary)
