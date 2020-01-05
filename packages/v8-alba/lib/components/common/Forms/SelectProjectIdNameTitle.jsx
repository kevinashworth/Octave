import { registerComponent } from 'meteor/vulcan:lib'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { FormGroup, Input, Label } from 'reactstrap'
import Select from 'react-select'
import _ from 'lodash'
import { customStyles, theme } from './react-select-settings'
import { CASTING_TITLES_ENUM } from '../../../modules/constants.js'

import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys'
const OptimizedSelect = onlyUpdateForKeys(['value'])(Select)

/**
* This version explicity for projectId, projectTitle, titleForProject
* TODO: a DRY component of this to not repeat all this code in SelectPastProjectIdNameTitle.jsx
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
      itemIndex: this.props.itemIndex,
      projectId: this.props.value,
      projectTitle: '',
      selectedIdOption: null,
      selectedTitleOption: null
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
      selectedTitleOption: selectedOption
    })
    this.context.updateCurrentValues({
      [this.state.pathPrefix + 'titleForProject']: selectedOption.label
    })
  }

  componentDidMount () {
    const projects = this.props.document.projects
    const projectTitle = projects[this.state.itemIndex] ? projects[this.state.itemIndex].projectTitle : ''
    const titleForProject = projects[this.state.itemIndex] ? projects[this.state.itemIndex].titleForProject : ''
    const selectedIdOption = _.find(this.props.options, { value: this.props.value }) || null
    const selectedTitleOption = _.find(CASTING_TITLES_ENUM, { value: titleForProject }) || null

    this.setState({
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
            styles={customStyles}
            maxMenuHeight={400}
            theme={theme}
            id={`projectId${this.state.itemIndex}`}
            value={this.state.selectedIdOption}
            onChange={this.handleIdChange}
            options={this.props.options}
            isClearable
            resetValue={{ value: null, label: '' }}
          />
        </FormGroup>
        <FormGroup>
          <Label for={`projectTitle${this.state.itemIndex}`}>Editable Name</Label>
          <Input
            type='text'
            id={`projectTitle${this.state.itemIndex}`}
            value={this.state.projectTitle}
            onChange={this.handleNameChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for={`titleForProject${this.state.itemIndex}`}>Title for Project</Label>
          <OptimizedSelect
            styles={customStyles}
            maxMenuHeight={400}
            theme={theme}
            id={`titleForProject${this.state.itemIndex}`}
            value={this.state.selectedTitleOption}
            onChange={this.handleTitleChange}
            options={CASTING_TITLES_ENUM}
            isClearable
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

registerComponent({
  name: 'SelectProjectIdNameTitle',
  component: SelectProjectIdNameTitle
})
