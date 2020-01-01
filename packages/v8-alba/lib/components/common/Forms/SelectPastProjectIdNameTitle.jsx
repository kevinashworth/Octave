import { registerComponent } from 'meteor/vulcan:lib'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { FormGroup, Input, Label } from 'reactstrap'
import Select from 'react-select'
import _ from 'lodash'
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
      pathPrefix: this.props.parentFieldName + '.' + this.props.itemIndex + '.',
      projectId: this.props.value
    }
  }

  handleIdChange (selectedOption) {
    this.setState({
      projectId: selectedOption.value,
      projectTitle: selectedOption.label
    })
    this.context.updateCurrentValues({
      [this.state.path]: selectedOption.value,
      [this.state.pathPrefix + 'projectTitle']: selectedOption.label
    })
  }

  handleNameChange ({ target }) {
    this.setState({
      projectTitle: target.value
    })
    this.context.updateCurrentValues({
      [this.state.pathPrefix + 'projectTitle']: target.value
    })
  }

  handleTitleChange (selectedOption) {
    this.setState({
      titleForProject: selectedOption.label
    })
    this.context.updateCurrentValues({
      [this.state.pathPrefix + 'titleForProject']: selectedOption.label
    })
  }

  render () {
    const pastProjects = this.props.document.pastProjects
    const itemIndex = this.props.itemIndex
    const projectTitle = pastProjects[itemIndex] ? pastProjects[itemIndex].projectTitle : ''
    const titleForProject = pastProjects[itemIndex] ? pastProjects[itemIndex].titleForProject : ''
    const selectedIdOption = _.find(this.props.options, { value: this.props.value }) || null
    const selectedTitleOption = _.find(CASTING_TITLES_ENUM, { value: titleForProject }) || null

    return (
      <div>
        <FormGroup>
          <Label for={`pastProjectId${itemIndex}`}>Past Project from Database</Label>
          <OptimizedSelect
            id={`pastProjectId${itemIndex}`}
            value={selectedIdOption}
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
          />
        </FormGroup>
        <FormGroup>
          <Label for={`titleForPastProject${itemIndex}`}>Title for Past Project</Label>
          <OptimizedSelect
            id={`titleForPastProject${itemIndex}`}
            value={selectedTitleOption}
            onChange={this.handleTitleChange}
            options={CASTING_TITLES_ENUM}
            resetValue={{ value: null, label: '' }}
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
