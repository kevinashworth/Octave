import { registerComponent } from 'meteor/vulcan:lib'
import React, { PureComponent } from 'react'
import { FormGroup, Input, Label } from 'reactstrap'
import Select from 'react-virtualized-select'
import PropTypes from 'prop-types'
import { CASTING_TITLES_ENUM } from '../../modules/constants.js'

import pure from 'recompose/pure'
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys'
const OptimizedInput = pure(Input)
const OptimizedSelect = onlyUpdateForKeys(['value'])(Select)

/**
* This version explicity for projectId, projectTitle, titleForProject
* TODO: a DRY component of this to not repeat all this code in SelectContactIdNameTitle.jsx
*/

class SelectProjectIdNameTitle extends PureComponent {
  constructor (props) {
    super(props)

    this.handleIdChange = this.handleIdChange.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleTitleChange = this.handleTitleChange.bind(this)

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

  handleIdChange (value) {
    this.setState({
      value,
      projectTitle: value.label
    })
    this.context.updateCurrentValues({
      [this.state.path]: value.value,
      [this.state.pathPrefix + 'projectTitle']: value.label
    })
  }

  handleNameChange ({ target }) {
    this.setState({
      [target.id]: target.value
    })
    const path = this.state.pathPrefix + target.id
    this.context.updateCurrentValues({
      [path]: target.value
    })
  }

  handleTitleChange (value) {
    this.setState({
      titleForProject: value.label
    })
    this.context.updateCurrentValues({
      [this.state.pathPrefix + 'titleForProject']: value.label
    })
  }

  render () {
    return (
      <div>
        <FormGroup>
          <Label for='projectId'>Project Name from Database</Label>
          <OptimizedSelect
            id='projectId'
            value={this.state.value}
            onChange={this.handleIdChange}
            options={this.props.options}
            resetValue={{ value: null, label: '' }}
          />
        </FormGroup>
        <FormGroup>
          <Label for='projectTitle'>Editable Project Name</Label>
          <OptimizedInput
            type='text'
            id='projectTitle'
            value={this.state.projectTitle}
            onChange={this.handleNameChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for='titleForProject'>Contact's Title for This Project</Label>
          <OptimizedSelect
            id='titleForProject'
            value={this.state.titleForProject}
            onChange={this.handleTitleChange}
            options={CASTING_TITLES_ENUM}
            resetValue={{ value: null, label: '' }}
            required
          />
        </FormGroup>
      </div>
    )
  }
}

SelectProjectIdNameTitle.contextTypes = {
  updateCurrentValues: PropTypes.func
}

registerComponent('SelectProjectIdNameTitle', SelectProjectIdNameTitle)