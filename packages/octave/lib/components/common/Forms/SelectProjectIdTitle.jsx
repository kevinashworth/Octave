import React from 'react'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form'
import Select from 'react-select-virtualized'
import find from 'lodash/find'
import { customStyles, theme } from './react-select-settings'
import { CASTING_TITLES_ENUM } from '../../../modules/constants.js'

/**
 * @component
 * @summary Displays 2 Selects together to choose projectId/projectTitle and titleForProject. Used when editing Projects and Past Projects on a Contact.
 */
const SelectProjectIdTitle = (props, context) => {
  const { collectionName = 'projects', document, itemIndex, options, parentFieldName, path, value } = props
  const projects = document[collectionName]
  const label = collectionName === 'pastProjects' ? 'Past Project' : 'Project'

  const pathPrefix = parentFieldName + '.' + itemIndex + '.'
  const selectedIdOption = find(options, { value: value })
  const titleForProject = projects[itemIndex] && projects[itemIndex].titleForProject
  const selectedTitleOption = (titleForProject && find(CASTING_TITLES_ENUM, { value: titleForProject }))

  const handleIdChange = (selectedOption) => {
    context.updateCurrentValues({
      [path]: selectedOption && selectedOption.value,
      [pathPrefix + 'projectTitle']: selectedOption && selectedOption.label
    })
  }

  const handleTitleChange = (selectedOption) => {
    context.updateCurrentValues({
      [pathPrefix + 'titleForProject']: selectedOption && selectedOption.label
    })
  }

  let inputId = `data-cy-select-${collectionName === 'projects' ? 'project' : 'pastproject'}-id`
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
        <Form.Label htmlFor={`projectId${itemIndex}`}>{label} Name</Form.Label>
        <Select
          styles={customStyles}
          maxMenuHeight={500}
          theme={theme}
          id={`projectId${itemIndex}`}
          inputId={inputId}
          value={selectedIdOption}
          onChange={handleIdChange}
          options={options}
          isClearable
        />
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor={`titleForProject${itemIndex}`}>Title for {label}</Form.Label>
        <Select
          styles={customStyles}
          maxMenuHeight={500}
          theme={theme}
          id={`titleForProject${itemIndex}`}
          value={selectedTitleOption}
          onChange={handleTitleChange}
          options={CASTING_TITLES_ENUM}
          isClearable
        />
      </Form.Group>
    </>
  )
}

SelectProjectIdTitle.propTypes = {
  /**
   * 'projects' (default) or 'pastProjects'
   */
  collectionName: PropTypes.string
}

SelectProjectIdTitle.contextTypes = {
  updateCurrentValues: PropTypes.func
}

export default SelectProjectIdTitle
