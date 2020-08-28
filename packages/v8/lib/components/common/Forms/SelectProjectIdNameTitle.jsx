/*
 * Specialized 3-part Select for projectId (`props.value`), projectTitle, titleForProject
 * TODO: a DRY component of this to not repeat all this code in SelectPastProjectIdNameTitle.jsx
 */
import { registerComponent } from 'meteor/vulcan:lib'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form'
import Select from 'react-select-virtualized'
import find from 'lodash/find'
import { customStyles, theme } from './react-select-settings'
import { CASTING_TITLES_ENUM, nullOption } from '../../../modules/constants.js'

const SelectProjectIdNameTitle = (props, context) => {
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
    const projects = props.document.projects
    if (projects) {
      const projectTitle = (projects[itemIndex] && projects[itemIndex].projectTitle) || ''
      const selectedIdOption = find(options, { value: value }) || nullOption
      const titleForProject = projects[itemIndex] && projects[itemIndex].titleForProject
      const selectedTitleOption = (titleForProject && find(CASTING_TITLES_ENUM, { value: titleForProject })) || nullOption

      setProjectTitle(projectTitle)
      setSelectedIdOption(selectedIdOption)
      setSelectedTitleOption(selectedTitleOption)
    }
  }, [])

  return (
    <>
      <Form.Group>
        <Form.Label htmlFor={`projectId${itemIndex}`}>Project Name</Form.Label>
        <Select
          styles={customStyles}
          maxMenuHeight={500}
          theme={theme}
          id={`projectId${itemIndex}`}
          value={selectedIdOption}
          onChange={handleIdChange}
          options={options}
          isClearable
          resetValue={nullOption}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor={`projectTitle${itemIndex}`}>Editable Name</Form.Label>
        <Form.Control
          type='text'
          id={`projectTitle${itemIndex}`}
          value={projectTitle}
          onChange={handleNameChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor={`titleForProject${itemIndex}`}>Title for Project</Form.Label>
        <Select
          styles={customStyles}
          maxMenuHeight={500}
          theme={theme}
          id={`titleForProject${itemIndex}`}
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

SelectProjectIdNameTitle.contextTypes = {
  updateCurrentValues: PropTypes.func
}

registerComponent({
  name: 'SelectProjectIdNameTitle',
  component: SelectProjectIdNameTitle
})
