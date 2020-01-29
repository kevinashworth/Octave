import { registerComponent } from 'meteor/vulcan:lib'
import { intlShape } from 'meteor/vulcan:i18n'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import _ from 'lodash'
import { customStyles, theme } from './react-select-settings'

class MySelect extends Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (selectedOption) {
    if (!selectedOption) {
      this.context.updateCurrentValues({ [this.props.path]: null })
      return
    }
    let siblingPath = null
    if (this.props.parentFieldName === 'projects' || this.props.parentFieldName === 'pastProjects') {
      siblingPath = this.props.parentFieldName + '.' + this.props.itemIndex + '.' + 'projectTitle'
    }
    if (this.props.parentFieldName === 'offices') {
      siblingPath = this.props.parentFieldName + '.' + this.props.itemIndex + '.' + 'officeName'
    }
    if (siblingPath) {
      this.context.updateCurrentValues({
        [this.props.path]: selectedOption.value,
        [siblingPath]: selectedOption.label
      })
    } else {
      this.context.updateCurrentValues({ [this.props.path]: selectedOption.value })
      console.log(`Just set ${this.props.path} to ${selectedOption.value}`)
    }
  }

  componentDidMount () {
    const selectedOption = _.find(this.props.options, { value: this.props.value }) || null
    if (selectedOption) {
      let siblingPath = null
      if (this.props.parentFieldName === 'projects' || this.props.parentFieldName === 'pastProjects') {
        siblingPath = this.props.parentFieldName + '.' + this.props.itemIndex + '.' + 'projectTitle'
      }
      if (siblingPath) {
        this.context.updateCurrentValues({
          [this.props.path]: selectedOption.value,
          [siblingPath]: selectedOption.label
        })
      }
    }
  }

  render () {
    const { inputOnly } = this.props.itemProperties
    const selectedOption = _.find(this.props.options, { value: this.props.value }) || null

    const theSelect = () => {
      return (
        <Select
          styles={customStyles}
          maxMenuHeight={400}
          theme={theme}
          value={selectedOption}
          onChange={this.handleChange}
          options={this.props.options}
          defaultValue={{ value: null, label: '' }}
          isClearable
        />
      )
    }

    if (inputOnly) {
      return (
        <>
          {theSelect()}
        </>
      )
    } else {
      return (
        <div className='form-group row'>
          <label className='form-label col-form-label col-sm-3'>{this.props.label}</label>
          <div className='col-sm-9'>
            {theSelect()}
          </div>
        </div>
      )
    }
  }
}

MySelect.contextTypes = {
  updateCurrentValues: PropTypes.func,
  intl: intlShape
}

registerComponent('MySelect', MySelect)
