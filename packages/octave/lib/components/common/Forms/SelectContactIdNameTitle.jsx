/*
 * Specialized 3-part Select for contactId (props.value), contactName, contactTitle
 */
import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import find from 'lodash/find'
import Form from 'react-bootstrap/Form'
import Select from 'react-select-virtualized'
import _debounce from 'lodash/debounce'
import { customStyles, theme } from './react-select-settings'
import { CASTING_TITLES_ENUM } from '../../../modules/constants.js'
import { useMount, useUnmount } from '../../../hooks'

const SelectContactIdNameTitle = (props, context) => {
  const { document: { contacts }, itemIndex, options, parentFieldName, path, value } = props
  const pathPrefix = parentFieldName + '.' + itemIndex + '.'
  const selectedIdOption = find(options, { value: value })
  const selectedTitleOption = find(CASTING_TITLES_ENUM, { value: contacts[itemIndex]?.contactTitle })
  const [contactName, setContactName] = useState('')

  useMount(() => {
    const name = contacts[itemIndex] && contacts[itemIndex].contactName
    if (name) {
      setContactName(name)
    }
  })

  useUnmount(() => {
    updateCurrentValuesDebounced.cancel()
  })

  const handleIdChange = (selectedOption) => {
    context.updateCurrentValues({
      [path]: selectedOption && selectedOption.value,
      [pathPrefix + 'contactName']: selectedOption && selectedOption.label
    })
    setContactName(selectedOption.label)
  }

  // use debounce when both keyboard input and updateCurrentValues
  // (but not other occurrences of updateCurrentValues)
  const updateCurrentValues = (value) => {
    context.updateCurrentValues({
      [pathPrefix + 'contactName']: value
    })
  }
  const updateCurrentValuesDebounced = useCallback(_debounce(updateCurrentValues, 250), [])
  const handleNameChange = ({ currentTarget: { value } }) => {
    setContactName(value)
    updateCurrentValuesDebounced(value)
  }

  const handleTitleChange = (selectedOption) => {
    context.updateCurrentValues({
      [pathPrefix + 'contactTitle']: selectedOption && selectedOption.label
    })
  }

  let inputId = 'data-cy-select-contact-id'
  if (path) {
    inputId += '-' + path
  } else if (itemIndex) {
    inputId += '-' + itemIndex
  } else if (parentFieldName) {
    inputId += '-' + parentFieldName
  }

  return (
    <>
      <Form.Group>
        <Form.Label htmlFor={`contactId${itemIndex}`}>Name from Database</Form.Label>
        <Select
          styles={customStyles}
          maxMenuHeight={500}
          theme={theme}
          id={`contactId${itemIndex}`}
          inputId={inputId}
          value={selectedIdOption}
          onChange={handleIdChange}
          options={options}
          isClearable
        />
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor={`contactName${itemIndex}`}>Editable Name</Form.Label>
        <Form.Control
          type='text'
          id={`contactName${itemIndex}`}
          value={contactName}
          onChange={handleNameChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor={`contactTitle${itemIndex}`}>Title for This</Form.Label>
        <Select
          styles={customStyles}
          maxMenuHeight={500}
          theme={theme}
          id={`contactTitle${itemIndex}`}
          value={selectedTitleOption}
          onChange={handleTitleChange}
          options={CASTING_TITLES_ENUM}
          isClearable
        />
      </Form.Group>
    </>
  )
}

SelectContactIdNameTitle.contextTypes = {
  updateCurrentValues: PropTypes.func
}

export default SelectContactIdNameTitle
