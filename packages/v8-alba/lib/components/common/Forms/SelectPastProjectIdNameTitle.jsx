import { registerComponent } from 'meteor/vulcan:lib'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { FormGroup, Input, Label } from 'reactstrap'
import Select from 'react-select-virtualized'
import _ from 'lodash'
import { customStyles, theme } from './react-select-settings'
import { CASTING_TITLES_ENUM, nullOption } from '../../../modules/constants.js'

import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys'
const OptimizedSelect = onlyUpdateForKeys(['value'])(Select)

/**
* This version explicity for projectId, projectTitle, titleForProject
* TODO: a DRY component of this to not repeat all this code in SelectProjectIdNameTitle.jsx
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
      projectId: this.props.value,
      projectTitle: '',
      selectedIdOption: nullOption,
      selectedTitleOption: nullOption
    }
  }

  handleIdChange (selectedOption) {
    this.setState({
      projectId: selectedOption.value,
      projectTitle: selectedOption.label,
      selectedIdOption: selectedOption
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
    const pastProjects = this.props.document.pastProjects
    const projectTitle = pastProjects[this.props.itemIndex] ? pastProjects[this.props.itemIndex].projectTitle : ''
    const titleForProject = pastProjects[this.props.itemIndex] ? pastProjects[this.props.itemIndex].titleForProject : ''
    const selectedIdOption = _.find(this.props.options, { value: this.props.value }) || nullOption
    const selectedTitleOption = _.find(CASTING_TITLES_ENUM, { value: titleForProject }) || nullOption

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
          <Label for={`pastProjectId${this.props.itemIndex}`}>Past Project from Database</Label>
          <OptimizedSelect
            styles={customStyles}
            maxMenuHeight={400}
            theme={theme}
            id={`pastProjectId${this.props.itemIndex}`}
            value={this.state.selectedIdOption}
            onChange={this.handleIdChange}
            options={this.props.options}
            isClearable
            resetValue={nullOption}
          />
        </FormGroup>
        <FormGroup>
          <Label for={`pastProjectTitle${this.props.itemIndex}`}>Editable Past Project Name</Label>
          <Input
            type='text'
            id={`pastProjectTitle${this.props.itemIndex}`}
            value={this.state.projectTitle}
            onChange={this.handleNameChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for={`titleForPastProject${this.props.itemIndex}`}>Title for Past Project</Label>
          <OptimizedSelect
            styles={customStyles}
            maxMenuHeight={400}
            theme={theme}
            id={`titleForPastProject${this.props.itemIndex}`}
            value={this.state.selectedTitleOption}
            onChange={this.handleTitleChange}
            options={CASTING_TITLES_ENUM}
            isClearable
            resetValue={nullOption}
          />
        </FormGroup>
      </div>
    )
  }
}

SelectPastProjectIdNameTitle.contextTypes = {
  updateCurrentValues: PropTypes.func
}

registerComponent({
  name: 'SelectPastProjectIdNameTitle',
  component: SelectPastProjectIdNameTitle
})
