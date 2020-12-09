import { registerComponent } from 'meteor/vulcan:core'
import React, { Component } from 'react'

class ErrorBoundary extends Component {
  constructor (props) {
    super(props)
    this.state = {
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError () {
    // Update state so the next render will show the fallback UI
    return { error: true }
  }

  componentDidCatch (error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    // You can also log error messages to an error reporting service here
    console.info('ErrorBounday:', error, errorInfo)
  }

  render () {
    if (this.state.error) {
      return (
        <div>
          <h4>Something went wrong.</h4>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      )
    }
    // Normally, just render children
    return this.props.children
  }
}

registerComponent('ErrorBoundary', ErrorBoundary)

export default ErrorBoundary
