import { registerComponent } from 'meteor/vulcan:lib'
import { intlShape } from 'meteor/vulcan:i18n'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CreatableSelect from 'react-select/creatable'
import _ from 'lodash'
import { customStyles, theme } from './react-select-settings'

class MyDatalist extends Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange = (newValue, actionMeta) => {
    if (actionMeta.action === 'create-option') {
      this.context.updateCurrentValues({
        [this.props.path]: newValue.value
      })
    }
    if (actionMeta.action === 'select-option') {
      this.context.updateCurrentValues({
        [this.props.path]: newValue.label
      })
    }
  }

  componentDidMount () {
    // if it's one of the values in the system
    let selectedOption = _.find(this.props.options, { value: this.props.value })
    // if it's a value the user has input
    if (!selectedOption) {
      selectedOption = { value: this.props.value, label: this.props.value }
    }
    if (selectedOption) {
      this.context.updateCurrentValues({
        [this.props.path]: selectedOption.value
      })
    }
  }

  render () {
    // if it's one of the values in the system
    let selectedOption = _.find(this.props.options, { value: this.props.value })
    // if it's a value the user has input
    if (!selectedOption) {
      selectedOption = { value: this.props.value, label: this.props.value }
    }
    return (
      <div className='form-group row'>
        <label className='form-label col-form-label col-sm-3'>{this.props.label}</label>
        <div className='col-sm-9'>
          <CreatableSelect
            styles={customStyles}
            maxMenuHeight={400}
            theme={theme}
            isClearable
            onChange={this.handleChange}
            onInputChange={this.handleInputChange}
            defaultValue={{ value: null, label: '' }}
            options={this.props.options}
            value={selectedOption}
          />
        </div>
      </div>
    )
  }
}

MyDatalist.contextTypes = {
  updateCurrentValues: PropTypes.func,
  intl: intlShape
}

registerComponent({
  name: 'MyDatalist',
  component: MyDatalist
})
