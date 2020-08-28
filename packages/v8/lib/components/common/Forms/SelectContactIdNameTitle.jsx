/*
 * Specialized 3-part Select for contactId (props.value), contactName, contactTitle
 */
import { registerComponent } from 'meteor/vulcan:lib'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form'
import Select from 'react-select-virtualized'
import find from 'lodash/find'
import { customStyles, theme } from './react-select-settings'
import { CASTING_TITLES_ENUM, nullOption } from '../../../modules/constants.js'

const SelectContactIdNameTitle = (props, context) => {
  const { itemIndex, options, value } = props
  const pathPrefix = props.parentFieldName + '.' + itemIndex + '.'

  const [contactName, setContactName] = useState('')
  const [selectedIdOption, setSelectedIdOption] = useState(nullOption)
  const [selectedTitleOption, setSelectedTitleOption] = useState(nullOption)

  const handleIdChange = (selectedOption) => {
    setContactName(selectedOption.label)
    setSelectedIdOption(selectedOption)
    context.updateCurrentValues({
      [props.path]: selectedOption.value,
      [pathPrefix + 'contactName']: selectedOption.label
    })
  }

  const handleNameChange = ({ target }) => {
    setContactName(target.value)
    context.updateCurrentValues({
      [pathPrefix + 'contactName']: target.value
    })
  }

  const handleTitleChange = (selectedOption) => {
    setSelectedTitleOption(selectedOption)
    context.updateCurrentValues({
      [pathPrefix + 'contactTitle']: selectedOption.label
    })
  }

  // put 'run once' code here (similar to componentDidMount)
  useEffect(() => {
    const contacts = props.document.contacts
    if (contacts) {
      const contactName = (contacts[itemIndex] && contacts[itemIndex].contactName) || ''
      const selectedIdOption = find(options, { value: value }) || nullOption
      const contactTitle = contacts[itemIndex] && contacts[itemIndex].contactTitle
      const selectedTitleOption = (contactTitle && find(CASTING_TITLES_ENUM, { value: contactTitle })) || nullOption
      setContactName(contactName)
      setSelectedIdOption(selectedIdOption)
      setSelectedTitleOption(selectedTitleOption)
    }
  }, [])

  return (
    <>
      <Form.Group>
        <Form.Label htmlFor={`contactId${itemIndex}`}>Name from Database</Form.Label>
        <Select
          styles={customStyles}
          maxMenuHeight={500}
          theme={theme}
          id={`contactId${itemIndex}`}
          value={selectedIdOption}
          onChange={handleIdChange}
          options={options}
          isClearable
          resetValue={nullOption}
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
          resetValue={nullOption}
        />
      </Form.Group>
    </>
  )
}

SelectContactIdNameTitle.contextTypes = {
  updateCurrentValues: PropTypes.func
}

registerComponent({
  name: 'SelectContactIdNameTitle',
  component: SelectContactIdNameTitle
})
