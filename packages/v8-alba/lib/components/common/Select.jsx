import { registerComponent } from 'meteor/vulcan:lib'
import React, { PureComponent } from 'react'
import Select from 'react-select'
import PropTypes from 'prop-types'
import { logger } from '../../modules/logger.js'

class MySelect extends PureComponent {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)

    this.state = {
      value: this.props.value
    }
  }

  handleChange (value) {
    this.setState({ value })

    let siblingPath = null
    if (this.props.parentFieldName === 'projects' || this.props.parentFieldName === 'pastProjects') {
      siblingPath = this.props.parentFieldName + '.' + this.props.itemIndex + '.' + 'projectTitle'
      logger.debug('We have a siblingPath!', siblingPath)
    }
    if (siblingPath) {
      this.context.updateCurrentValues({
        [this.props.path]: value.value,
        [siblingPath]: value.label
      })
    } else {
      this.context.updateCurrentValues({ [this.props.path]: value.value })
    }

    logger.groupCollapsed('MySelect:')
    logger.log(`MySelect label: ${value.label}`)
    logger.log(`MySelect value: ${value.value}`)
    logger.groupEnd()
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
