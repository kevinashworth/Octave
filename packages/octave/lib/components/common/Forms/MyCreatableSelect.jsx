import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import CreatableSelect from 'react-select/creatable'
import find from 'lodash/find'
import { customStyles, theme } from './react-select-settings'

const groupStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}

const formatGroupLabel = data => (
  <div style={groupStyles}>
    <span>{data.label}</span>
  </div>
)

// Reminder about value: props.value is just a string while
// CreatableSelect's value is an object with the keys label and value
const MyCreatableSelect = (props, context) => {
  const { itemIndex, itemProperties: { flattenedOptions }, label, path, placeholder, value: propsValue } = props
  const [options, setOptions] = useState(props.options)
  const [value, setValue] = useState(null)

  // runs on mount and runs on props change, needed for react-sortable-hoc reordering
  useEffect(() => {
    let selectedOption = null
    if (propsValue) {
      // is it a value in the system
      selectedOption = find(flattenedOptions, { label: propsValue })
      if (!selectedOption) {
        // is it a custom value already in the list
        selectedOption = find(options, { label: propsValue })
        if (!selectedOption) {
          // else it is a new custom value
          selectedOption = { value: propsValue, label: propsValue }
          setOptions([selectedOption, ...options])
        }
      }
      setValue(selectedOption)
    }
  }, [flattenedOptions, options, propsValue])

  const handleChange = (newValue, actionMeta) => {
    if (actionMeta.action === 'create-option') {
      context.updateCurrentValues({
        [path]: newValue.value
      })
      setOptions([newValue, ...options])
      setValue(newValue)
    }
    if (actionMeta.action === 'select-option') {
      context.updateCurrentValues({
        [path]: newValue.label
      })
      setValue(newValue)
    }
    if (actionMeta.action === 'clear') {
      context.updateCurrentValues({
        [path]: null
      })
      setValue(null)
    }
  }

  let inputId = 'data-cy-my-creatable-select'
  if (path) {
    inputId += '-' + path
  } else if (itemIndex) {
    inputId += '-' + itemIndex
  }

  return (
    <div className='form-group row'>
      <label className='form-label col-form-label col-sm-3'>{label}</label>
      <div className='col-sm-9'>
        <CreatableSelect
          formatGroupLabel={formatGroupLabel}
          inputId={inputId}
          isClearable
          maxMenuHeight={500}
          onChange={handleChange}
          options={options}
          placeholder={placeholder}
          styles={customStyles}
          theme={theme}
          value={value}
        />
      </div>
    </div>
  )
}

MyCreatableSelect.contextTypes = {
  updateCurrentValues: PropTypes.func
}

export default MyCreatableSelect
