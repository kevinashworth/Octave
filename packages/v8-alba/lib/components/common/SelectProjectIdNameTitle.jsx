import { registerComponent } from 'meteor/vulcan:lib'
import React, { PureComponent } from 'react'
import { FormGroup, Input, Label } from 'reactstrap'
import Select from 'react-virtualized-select'
import PropTypes from 'prop-types'

import pure from 'recompose/pure'
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys'
const OptimizedInput = pure(Input)
const OptimizedSelect = onlyUpdateForKeys(['value'])(Select)

/**
* This version explicity for projectId, projectTitle, titleForProject
* Also working on a DRY component called (for now) SelectIdGenericWIP.jsx
*/

class SelectProjectIdNameTitle extends PureComponent {
  constructor (props) {
    super(props)

    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)

    const nestedFields = Object.keys(this.props.nestedSchema)
    const projects = this.props.document.projects
    const itemIndex = this.props.itemIndex
    const projectTitle = projects[itemIndex] ? projects[itemIndex].projectTitle : ''
    const titleForProject = projects[itemIndex] ? projects[itemIndex].titleForProject : ''

    this.state = {
      selectField: nestedFields.shift(), // get first field, shift remaining
      indexFields: nestedFields,
      value: this.props.value,
      path: this.props.path,
      pathPrefix: this.props.parentFieldName + '.' + this.props.itemIndex + '.',
      projectTitle: projectTitle,
      titleForProject: titleForProject
    }
  }

  handleSelectChange = (value) => {
    this.setState({
      value,
      projectTitle: value.label
    })
    this.context.updateCurrentValues({
      [this.state.path]: value.value,
      [this.state.pathPrefix + 'projectTitle']: value.label
    })
  }

  handleInputChange = ({ target }) => {
    this.setState({
      [target.id]: target.value
    })
    const path = this.state.pathPrefix + target.id
    this.context.updateCurrentValues({
      [path]: target.value
    })
  }

  render () {
    return (
      <FormGroup>
        <Label for='projectId'>Project Name from Database</Label>
        <OptimizedSelect
          id='projectId'
          value={this.state.value}
          onChange={this.handleSelectChange}
          options={this.props.options}
          resetValue={{ value: null, label: '' }}
        />
        <Label for='projectTitle'>Editable Project Name</Label>
        <OptimizedInput
          type='text'
          id='projectTitle'
          value={this.state.projectTitle}
          onChange={this.handleInputChange}
          required
        />
        <Label for='titleForProject'>Contact's Title for Project</Label>
        <OptimizedInput
          type='text'
          id='titleForProject'
          value={this.state.titleForProject}
          onChange={this.handleInputChange}
          required
        />
      </FormGroup>

    )
  }
}

SelectProjectIdNameTitle.contextTypes = {
  updateCurrentValues: PropTypes.func
}

registerComponent('SelectProjectIdNameTitle', SelectProjectIdNameTitle)
