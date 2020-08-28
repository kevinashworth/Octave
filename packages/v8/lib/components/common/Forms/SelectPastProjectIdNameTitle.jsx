/*
 * Specialized 3-part Select for projectId (`props.value`), projectTitle, titleForProject
 * TODO: a DRY component of this to not repeat all this code in SelectProjectIdNameTitle.jsx
 */
import { registerComponent } from 'meteor/vulcan:lib'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form'
import Select from 'react-select-virtualized'
import find from 'lodash/find'
import { customStyles, theme } from './react-select-settings'
import { CASTING_TITLES_ENUM, nullOption } from '../../../modules/constants.js'

const SelectPastProjectIdNameTitle = (props, context) => {
  const { itemIndex, options, value } = props
  const pathPrefix = props.parentFieldName + '.' + itemIndex + '.'

  const [projectTitle, setProjectTitle] = useState('')
  const [selectedIdOption, setSelectedIdOption] = useState(nullOption)
  const [selectedTitleOption, setSelectedTitleOption] = useState(nullOption)

  const handleIdChange = (selectedOption) => {
    setProjectTitle(selectedOption.label)
    setSelectedIdOption(selectedOption)
    context.updateCurrentValues({
      [props.path]: selectedOption.value,
      [pathPrefix + 'projectTitle']: selectedOption.label
    })
  }

  const handleNameChange = ({ target }) => {
    setProjectTitle(target.value)
    context.updateCurrentValues({
      [pathPrefix + 'projectTitle']: target.value
    })
  }

  const handleTitleChange = (selectedOption) => {
    setSelectedTitleOption(selectedOption)
    context.updateCurrentValues({
      [pathPrefix + 'titleForProject']: selectedOption.label
    })
  }

  // put 'run once' code here (similar to componentDidMount)
  useEffect(() => {
    const pastProjects = props.document.pastProjects
    if (pastProjects) {
      const projectTitle = (pastProjects[itemIndex] && pastProjects[itemIndex].projectTitle) || ''
      const selectedIdOption = find(options, { value: value }) || nullOption
      const titleForProject = pastProjects[itemIndex] && pastProjects[itemIndex].titleForProject
      const selectedTitleOption = (titleForProject && find(CASTING_TITLES_ENUM, { value: titleForProject })) || nullOption

      setProjectTitle(projectTitle)
      setSelectedIdOption(selectedIdOption)
      setSelectedTitleOption(selectedTitleOption)
    }
  }, [])

  return (
    <>
      <Form.Group>
        <Form.Label htmlFor={`pastProjectId${itemIndex}`}>Past Project from Database</Form.Label>
        <Select
          styles={customStyles}
          maxMenuHeight={500}
          theme={theme}
          id={`pastProjectId${itemIndex}`}
          value={selectedIdOption}
          onChange={handleIdChange}
          options={options}
          isClearable
          resetValue={nullOption}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor={`pastProjectTitle${itemIndex}`}>Editable Past Project Name</Form.Label>
        <Form.Control
          type='text'
          id={`pastProjectTitle${itemIndex}`}
          value={projectTitle}
          onChange={handleNameChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor={`titleForPastProject${itemIndex}`}>Title for Past Project</Form.Label>
        <Select
          styles={customStyles}
          maxMenuHeight={500}
          theme={theme}
          id={`titleForPastProject${itemIndex}`}
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

SelectPastProjectIdNameTitle.contextTypes = {
  updateCurrentValues: PropTypes.func
}

registerComponent({
  name: 'SelectPastProjectIdNameTitle',
  component: SelectPastProjectIdNameTitle
})
