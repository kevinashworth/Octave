import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select-virtualized'
import find from 'lodash/find'
import { customStyles, theme } from './react-select-settings'

const MySelect = (props, context) => {
  const { itemIndex, itemProperties: { inputOnly }, label, options, parentFieldName, path, value } = props
  let selectedOption = null
  if (value) {
    selectedOption = find(options, { value: value })
  }

  const handleChange = (selectedOption) => {
    if (!selectedOption) {
      context.updateCurrentValues({ [path]: null })
      return
    }
    let siblingPath = null
    if (parentFieldName === 'projects' || parentFieldName === 'pastProjects') {
      siblingPath = parentFieldName + '.' + itemIndex + '.' + 'projectTitle'
    } else if (parentFieldName === 'offices') {
      siblingPath = parentFieldName + '.' + itemIndex + '.' + 'officeName'
    }
    if (siblingPath) {
      context.updateCurrentValues({
        [path]: selectedOption.value,
        [siblingPath]: selectedOption.label
      })
    } else {
      context.updateCurrentValues({ [path]: selectedOption.value })
    }
  }

  let inputId = 'data-cy-my-select'
  if (path) {
    inputId += '-' + path
  } else if (itemIndex) {
    inputId += '-' + itemIndex
  } else if (parentFieldName) {
    inputId += '-' + parentFieldName
  }

  const SelectComponent = () => {
    return (
      <Select
        styles={customStyles}
        maxMenuHeight={500}
        theme={theme}
        inputId={inputId}
        value={selectedOption}
        onChange={handleChange}
        options={options}
        isClearable
      />
    )
  }

  if (inputOnly) {
    return (
      <SelectComponent />
    )
  } else {
    return (
      <div className='form-group row'>
        <label className='form-label col-form-label col-sm-3'>{label}</label>
        <div className='col-sm-9'>
          <SelectComponent />
        </div>
      </div>
    )
  }
}

MySelect.contextTypes = {
  updateCurrentValues: PropTypes.func
}

export default MySelect
