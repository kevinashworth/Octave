import { registerComponent } from 'meteor/vulcan:lib'
import React, { PureComponent } from 'react'
import { Col, FormGroup, Input, Label } from 'reactstrap'
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

class SelectProjectIdNameTitle extends PureComponent {
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
    const projects = this.props.document.projects
    const itemIndex = this.props.itemIndex
    const projectTitle = projects[itemIndex] ? projects[itemIndex].projectTitle : ''
    const titleForProject = projects[itemIndex] ? projects[itemIndex].titleForProject : ''
    const value = this.props.value

    return (
      <div>
        <FormGroup row>
          <Label for={`projectId${itemIndex}`} sm={3}>Project Name</Label>
          <Col sm={9}>
            <OptimizedSelect
              id={`projectId${itemIndex}`}
              value={value}
              onChange={this.handleIdChange}
              options={this.props.options}
              resetValue={{ value: null, label: '' }}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for={`projectTitle${itemIndex}`} sm={3}>Editable Name</Label>
          <Col sm={9}>
            <OptimizedInput
              type='text'
              id={`projectTitle${itemIndex}`}
              value={projectTitle}
              onChange={this.handleNameChange}
              required
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for={`titleForProject${itemIndex}`} sm={3}>Title for Project</Label>
          <Col sm={9}>
            <OptimizedSelect
              id={`titleForProject${itemIndex}`}
              value={titleForProject}
              onChange={this.handleTitleChange}
              options={CASTING_TITLES_ENUM}
              resetValue={{ value: null, label: '' }}
              required
            />
          </Col>
        </FormGroup>
      </div>
    )
  }
}

SelectProjectIdNameTitle.contextTypes = {
  updateCurrentValues: PropTypes.func
}

registerComponent('SelectProjectIdNameTitle', SelectProjectIdNameTitle)
