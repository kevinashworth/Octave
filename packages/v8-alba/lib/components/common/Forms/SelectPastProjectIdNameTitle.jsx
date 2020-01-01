import { registerComponent } from 'meteor/vulcan:lib'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { FormGroup, Input, Label } from 'reactstrap'
import Select from 'react-select'
import _ from 'lodash'
import { CASTING_TITLES_ENUM } from '../../../modules/constants.js'

// import pure from 'recompose/pure'
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys'
// const OptimizedInput = pure(Input)
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
      titleForProject: selectedOption.label
    })
    this.context.updateCurrentValues({
      [this.state.pathPrefix + 'titleForProject']: selectedOption.label
    })
  }

  componentDidMount () {
    const pastProjects = this.props.document.pastProjects
    const projectTitle = pastProjects[this.state.itemIndex] ? pastProjects[this.state.itemIndex].projectTitle : ''
    const titleForProject = pastProjects[this.state.itemIndex] ? pastProjects[this.state.itemIndex].titleForProject : ''
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
      <div>
        <FormGroup>
          <Label for={`pastProjectId${this.state.itemIndex}`}>Past Project from Database</Label>
          <OptimizedSelect
            id={`pastProjectId${this.state.itemIndex}`}
            value={this.state.selectedIdOption}
            onChange={this.handleIdChange}
            options={this.props.options}
            resetValue={{ value: null, label: '' }}
          />
        </FormGroup>
        <FormGroup>
          <Label for={`pastProjectTitle${this.state.this.state.itemIndex}`}>Editable Past Project Name</Label>
          <Input
            type='text'
            id={`pastProjectTitle${this.state.itemIndex}`}
            value={this.state.projectTitle}
            onChange={this.handleNameChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for={`titleForPastProject${this.state.itemIndex}`}>Title for Past Project</Label>
          <OptimizedSelect
            id={`titleForPastProject${this.state.itemIndex}`}
            value={this.state.selectedTitleOption}
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
