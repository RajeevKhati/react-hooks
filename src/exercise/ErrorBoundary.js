import React, {Component} from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
    }
  }

  static getDerivedStateFromError(error) {
    return {
      error: error.message,
    }
  }

  componentDidCatch(error, info) {
    console.log('myError ', error)
  }

  render() {
    if (this.state.error) {
      return (
        <div role="alert">
          There was an error:{' '}
          <pre style={{whiteSpace: 'normal'}}>{this.state.error}</pre>
        </div>
      )
    }
    return this.props.children
  }
}
