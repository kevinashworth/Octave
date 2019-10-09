import { registerComponent } from 'meteor/vulcan:lib'
import { intlShape } from 'meteor/vulcan:i18n'
import React, { Fragment, PureComponent } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import find from 'lodash/find'

class MySelect extends PureComponent {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)

    const initialValue = find(this.props.options, { value: this.props.value }) || null
    this.state = {
      selectedOption: initialValue
    }
  }

  handleChange (selectedOption) {
    this.setState({ selectedOption })

    let siblingPath = null
    if (this.props.parentFieldName === 'projects' || this.props.parentFieldName === 'pastProjects') {
      siblingPath = this.props.parentFieldName + '.' + this.props.itemIndex + '.' + 'projectTitle'
      // console.debug('We have a siblingPath!', siblingPath)
    }
    if (siblingPath) {
      this.context.updateCurrentValues({
        [this.props.path]: selectedOption.value,
        [siblingPath]: selectedOption.label
      })
    } else {
      this.context.updateCurrentValues({ [this.props.path]: selectedOption.value })
    }
    //
    // console.group('MySelect:')
    // console.log(`MySelect label: ${selectedOption.label}`)
    // console.log(`MySelect value: ${selectedOption.value}`)
    // console.groupEnd()
  }

  render () {
    const { selectOne } = this.props.inputProperties
    const { selectedOption } = this.state
    const noneOption = {
      label: this.context.intl.formatMessage({ id: 'forms.select_option' }),
      value: null,
      isDisabled: true
    }

    if (selectOne) {
      return (
        <div className='form-group row'>
          <label className='form-label col-form-label col-sm-3'>{this.props.label}</label>
          <div className='col-sm-9'>
            <Select
              value={selectedOption}
              onChange={this.handleChange}
              options={[noneOption, ...this.props.options]}
              />
          </div>
        </div>
      )
    } else {
      return (
        <Fragment>
          <Select
            value={selectedOption}
            onChange={this.handleChange}
            options={[noneOption, ...this.props.options]}
            />
        </Fragment>
      )
    }
  }
}

MySelect.contextTypes = {
  updateCurrentValues: PropTypes.func,
  intl: intlShape
}

registerComponent('MySelect', MySelect)
