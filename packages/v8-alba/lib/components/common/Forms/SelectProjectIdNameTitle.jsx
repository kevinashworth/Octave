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

class SelectProjectIdNameTitle extends PureComponent {
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

  componentDidMount () {
    const projects = this.props.document.projects
    const itemIndex = this.props.itemIndex
    const projectTitle = projects[itemIndex] ? projects[itemIndex].projectTitle : ''
    const titleForProject = projects[itemIndex] ? projects[itemIndex].titleForProject : ''
    const selectedIdOption = _.find(this.props.options, { value: this.props.value }) || null
    const selectedTitleOption = _.find(CASTING_TITLES_ENUM, { value: titleForProject }) || null

    this.setState({
      itemIndex,
      projectTitle,
      selectedIdOption,
      selectedTitleOption
    })
  }

  render () {
    return (
      <>
        <FormGroup>
          <Label for={`projectId${this.state.itemIndex}`}>Project Name</Label>
          <OptimizedSelect
            id={`projectId${this.state.itemIndex}`}
            value={this.state.selectedIdOption}
            onChange={this.handleIdChange}
            options={this.props.options}
            resetValue={{ value: null, label: '' }}
          />
        </FormGroup>
        <FormGroup>
          <Label for={`projectTitle${this.state.itemIndex}`}>Editable Name</Label>
          <OptimizedInput
            type='text'
            id={`projectTitle${this.state.itemIndex}`}
            value={this.state.projectTitle}
            onChange={this.handleNameChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for={`titleForProject${this.state.itemIndex}`}>Title for Project</Label>
          <OptimizedSelect
            id={`titleForProject${this.state.itemIndex}`}
            value={this.state.selectedTitleOption}
            onChange={this.handleTitleChange}
            options={CASTING_TITLES_ENUM}
            resetValue={{ value: null, label: '' }}
          />
        </FormGroup>
      </>
    )
  }
}

SelectProjectIdNameTitle.contextTypes = {
  updateCurrentValues: PropTypes.func
}

registerComponent('SelectProjectIdNameTitle', SelectProjectIdNameTitle)
