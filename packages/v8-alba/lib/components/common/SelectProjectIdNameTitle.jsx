import { registerComponent } from 'meteor/vulcan:lib'
import React, { PureComponent } from 'react'
import { Col, FormGroup, Input, Label } from 'reactstrap'
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

    // const nestedFields = Object.keys(this.props.nestedSchema)
    // const projects = this.props.document.projects
    // const itemIndex = this.props.itemIndex
    // const projectTitle = projects[itemIndex] ? projects[itemIndex].projectTitle : ''
    // const titleForProject = projects[itemIndex] ? projects[itemIndex].titleForProject : ''

    this.state = {
      // selectField: nestedFields.shift(), // get first field, shift remaining
      // indexFields: nestedFields,
      // value: this.props.value,
      path: this.props.path,
      pathPrefix: this.props.parentFieldName + '.' + this.props.itemIndex + '.',
      // projectTitle: projectTitle,
      // titleForProject: titleForProject
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
    const nestedFields = Object.keys(this.props.nestedSchema)
    const projects = this.props.document.projects
    const itemIndex = this.props.itemIndex
    const projectTitle = projects[itemIndex] ? projects[itemIndex].projectTitle : ''
    const titleForProject = projects[itemIndex] ? projects[itemIndex].titleForProject : ''

    const pseudoState = {
      selectField: nestedFields.shift(), // get first field, shift remaining
      indexFields: nestedFields,
      value: this.props.value,
      // path: this.props.path,
      // pathPrefix: this.props.parentFieldName + '.' + this.props.itemIndex + '.',
      projectTitle: projectTitle,
      titleForProject: titleForProject
    }

    return (
      <div>
        <FormGroup row>
          <Label for='projectId' sm={3}>Project Name</Label>
          <Col sm={9}>
            <OptimizedSelect
              id='projectId'
              value={pseudoState.value}
              onChange={this.handleIdChange}
              options={this.props.options}
              resetValue={{ value: null, label: '' }}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for='projectTitle' sm={3}>Editable Name</Label>
          <Col sm={9}>
            <OptimizedInput
              type='text'
              id='projectTitle'
              value={pseudoState.projectTitle}
              onChange={this.handleNameChange}
              required
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for='titleForProject' sm={3}>Title for Project</Label>
          <Col sm={9}>
            <OptimizedSelect
              id='titleForProject'
              value={pseudoState.titleForProject}
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
