import { registerComponent } from 'meteor/vulcan:lib'
import { intlShape } from 'meteor/vulcan:i18n'
import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import find from 'lodash/find'

class MySelect extends Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    //
    // const initialValue = find(this.props.options, { value: this.props.value }) || null
    // this.state = {
    //   selectedOption: initialValue
    // }
  }

  handleChange (selectedOption) {
    // this.setState({ selectedOption })

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

    // console.group('MySelect handleChange:')
    // console.log(`MySelect label: ${selectedOption.label}`)
    // console.log(`MySelect value: ${selectedOption.value}`)
    // console.groupEnd()
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.props.value !== nextProps.value) {
  //     console.group('MySelect value changed!')
  //     console.log('this.props.value:', this.props.value)
  //     console.log('nextProps.value:', nextProps.value)
  //     console.groupEnd()
  //     return true
  //   }
  //   // console.group('MySelect shouldComponentUpdate:')
  //   // console.log('nextProps:', nextProps)
  //   // console.log('nextState:', nextState)
  //   // console.groupEnd()
  //   return false
  // }

  render () {
    const { selectOne } = this.props.inputProperties
    // const { selectedOption } = this.state
    const selectedOption = find(this.props.options, { value: this.props.value }) || null
    const noneOption = {
      label: this.context.intl.formatMessage({ id: 'forms.select_option' }),
      value: null,
      isDisabled: true
    }

    const theSelect = () => {
      return (
        <Select
          value={selectedOption}
          onChange={this.handleChange}
          options={[noneOption, ...this.props.options]}
          isClearable
          />
      )
    }

    if (selectOne) {
      return (
        <div className='form-group row'>
          <label className='form-label col-form-label col-sm-3'>{this.props.label}</label>
          <div className='col-sm-9'>
            {theSelect()}
          </div>
        </div>
      )
    } else {
      return (
        <Fragment>
          {theSelect()}
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
