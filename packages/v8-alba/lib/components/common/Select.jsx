import { registerComponent } from 'meteor/vulcan:lib'
import React, { PureComponent } from 'react'
import Select from 'react-select'
import PropTypes from 'prop-types'

class MySelect extends PureComponent {
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
    console.log(`Selected label: ${value.label}\nSelected value: ${value.value}`)
    this.context.updateCurrentValues({ [this.state.path]: value.value })
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
          />
        </div>
      </div>
    )
  }
}

MySelect.contextTypes = {
  updateCurrentValues: PropTypes.func
}

registerComponent('MySelect', MySelect)
