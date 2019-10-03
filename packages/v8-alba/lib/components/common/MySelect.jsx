import { registerComponent } from 'meteor/vulcan:lib'
// import { intlShape } from 'meteor/vulcan:i18n'
import React, { PureComponent } from 'react'
import Select from 'react-select'
import PropTypes from 'prop-types'

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
      console.debug('We have a siblingPath!', siblingPath)
    }
    if (siblingPath) {
      this.context.updateCurrentValues({
        [this.props.path]: value.value,
        [siblingPath]: value.label
      })
    } else {
      this.context.updateCurrentValues({ [this.props.path]: value.value })
    }

    console.group('MySelect:')
    console.log(`MySelect label: ${value.label}`)
    console.log(`MySelect value: ${value.value}`)
    console.groupEnd()
  }

  render () {
    // const noneOption = {
    //   label: this.context.intl.formatMessage({ id: 'forms.select_option' }),
    //   value: null,
    //   disabled: true
    // }
    return (
      <div className='form-group row'>
        <label className='control-label col-sm-3'>{this.props.label}</label>
        <div className='col-sm-9'>
          <Select
            name='form-field-name'
            value={this.state.value}
            onChange={this.handleChange}
            options={{this.props.options}}
            resetValue={{ value: null, label: '' }}
          />
        </div>
      </div>
    )
  }
}

MySelect.contextTypes = {
  updateCurrentValues: PropTypes.func
  // intl: intlShape
}

registerComponent('MySelect', MySelect)
