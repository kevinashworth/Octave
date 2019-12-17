import { registerComponent } from 'meteor/vulcan:lib'
import React, { PureComponent } from 'react'
import { FormGroup, Input, Label } from 'reactstrap'
import Select from 'react-virtualized-select'
import PropTypes from 'prop-types'
import { CASTING_TITLES_ENUM } from '../../../modules/constants.js'

import pure from 'recompose/pure'
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys'
const OptimizedInput = pure(Input)
const OptimizedSelect = onlyUpdateForKeys(['value'])(Select)

/**
* This version explicity for projectId, projectTitle, titleForProject
* TODO: a DRY component of this to not repeat all this code in SelectContactIdNameTitle.jsx
*/

class SelectPastProjectIdNameTitle extends PureComponent {
  constructor (props) {
    super(props)

    this.handleIdChange = this.handleIdChange.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleTitleChange = this.handleTitleChange.bind(this)

    this.state = {
      path: this.props.path,
      pathPrefix: this.props.parentFieldName + '.' + this.props.itemIndex + '.'
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
      projectTitle: target.value
    })
    const path = this.state.pathPrefix + 'projectTitle'
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
    const pastProjects = this.props.document.pastProjects
    const itemIndex = this.props.itemIndex
    const projectTitle = pastProjects[itemIndex] ? pastProjects[itemIndex].projectTitle : ''
    const titleForProject = pastProjects[itemIndex] ? pastProjects[itemIndex].titleForProject : ''
    const value = this.props.value

    return (
      <div>
        <FormGroup>
          <Label for={`pastProjectId${itemIndex}`}>Past Project from Database</Label>
          <OptimizedSelect
            id={`pastProjectId${itemIndex}`}
            value={value}
            onChange={this.handleIdChange}
            options={this.props.options}
            resetValue={{ value: null, label: '' }}
          />
        </FormGroup>
        <FormGroup>
          <Label for={`pastProjectTitle${itemIndex}`}>Editable Past Project Name</Label>
          <OptimizedInput
            type='text'
            id={`pastProjectTitle${itemIndex}`}
            value={projectTitle}
            onChange={this.handleNameChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for={`titleForPastProject${itemIndex}`}>Title for Past Project</Label>
          <OptimizedSelect
            id={`titleForPastProject${itemIndex}`}
            value={titleForProject}
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

SelectPastProjectIdNameTitle.contextTypes = {
  updateCurrentValues: PropTypes.func
}

registerComponent('SelectPastProjectIdNameTitle', SelectPastProjectIdNameTitle)
