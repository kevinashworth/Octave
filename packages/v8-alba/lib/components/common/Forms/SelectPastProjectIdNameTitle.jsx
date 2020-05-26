import { registerComponent } from 'meteor/vulcan:lib'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import { FormGroup, Input, Label } from 'reactstrap'
import Form from 'react-bootstrap/Form'
import Select from 'react-select-virtualized'
import _ from 'lodash'
import { customStyles, theme } from './react-select-settings'
import { CASTING_TITLES_ENUM, nullOption } from '../../../modules/constants.js'

// import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys'
// import pure from 'recompose/pure'
// const PureSelect = pure(Select)
// const OptimizedSelect = onlyUpdateForKeys(['value'])(PureSelect)

/**
* This version explicity for projectId, projectTitle, titleForProject
* TODO: a DRY component of this to not repeat all this code in SelectProjectIdNameTitle.jsx
*/

const OptionsSelect = ({ options, ...otherProps }) => {
  return (
    <Select
      options={options}
      {...otherProps}
    />
  )
}

class SelectPastProjectIdNameTitle extends Component {
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
      <>
        <Form.Group>
          <Form.Label htmlFor={`pastProjectId${this.props.itemIndex}`}>Past Project from Database</Form.Label>
          <OptionsSelect
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
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor={`pastProjectTitle${this.props.itemIndex}`}>Editable Past Project Name</Form.Label>
          <Form.Control
            type='text'
            id={`pastProjectTitle${this.props.itemIndex}`}
            value={this.state.projectTitle}
            onChange={this.handleNameChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor={`titleForPastProject${this.props.itemIndex}`}>Title for Past Project</Form.Label>
          <Select
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
        </Form.Group>
      </>
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
