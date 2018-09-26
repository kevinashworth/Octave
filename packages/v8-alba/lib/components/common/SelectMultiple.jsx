import { registerComponent } from 'meteor/vulcan:lib'
import React, { PureComponent } from 'react'
import Select from 'react-select'
import PropTypes from 'prop-types'

class MySelectMultiple extends PureComponent {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.state = {
      value: this.props.value,
      path: this.props.path
    }
  }

  handleChange = (value) => {
    this.setState({ value })
    console.table(`Selected values: ${value}`)
    this.context.updateCurrentValues({ [this.state.path]: value })
  }

  render () {
    return (
      <div className='form-group row'>
        <label className='control-label col-sm-3'>{this.props.label}</label>
        <div className='col-sm-9'>
          <Select
            name='form-field-name'
            value={this.state.value}
            onChange={this.handleChange}
            options={this.props.options}
            resetValue={{ value: null, label: '' }}
            multi
          />
        </div>
      </div>
    )
  }
}

MySelectMultiple.contextTypes = {
  updateCurrentValues: PropTypes.func
}

registerComponent('MySelectMultiple', MySelectMultiple)
