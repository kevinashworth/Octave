import { registerComponent } from 'meteor/vulcan:lib'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { FormGroup, Input, Label } from 'reactstrap'
import Select from 'react-select'
import _ from 'lodash'
import { customStyles, theme } from './react-select-settings'
import { CASTING_TITLES_ENUM, nullOption } from '../../../modules/constants.js'

import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys'
const OptimizedSelect = onlyUpdateForKeys(['value'])(Select)

/**
* This version explicity for contactId, contactName, contactTitle
*/

class SelectContactIdNameTitle extends PureComponent {
  constructor (props) {
    super(props)

    this.handleIdChange = this.handleIdChange.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleTitleChange = this.handleTitleChange.bind(this)

    this.state = {
      path: this.props.path,
      pathPrefix: this.props.parentFieldName + '.' + this.props.itemIndex + '.',
      contactId: this.props.value,
      contactName: '',
      selectedIdOption: nullOption,
      selectedTitleOption: nullOption
    }
  }

  handleIdChange (selectedOption) {
    this.setState({
      contactId: selectedOption.value,
      contactName: selectedOption.label,
      selectedIdOption: selectedOption
    })
    this.context.updateCurrentValues({
      [this.state.path]: selectedOption.value,
      [this.state.pathPrefix + 'contactName']: selectedOption.label
    })
  }

  handleNameChange ({ target }) {
    this.setState({
      contactName: target.value
    })
    this.context.updateCurrentValues({
      [this.state.pathPrefix + 'contactName']: target.value
    })
  }

  handleTitleChange (selectedOption) {
    this.setState({
      selectedTitleOption: selectedOption
    })
    this.context.updateCurrentValues({
      [this.state.pathPrefix + 'contactTitle']: selectedOption.label
    })
  }

  componentDidMount () {
    const contacts = this.props.document.contacts
    const contactName = contacts[this.props.itemIndex] ? contacts[this.props.itemIndex].contactName : ''
    const contactTitle = contacts[this.props.itemIndex] ? contacts[this.props.itemIndex].contactTitle : ''
    const selectedIdOption = _.find(this.props.options, { value: this.props.value }) || nullOption
    const selectedTitleOption = _.find(CASTING_TITLES_ENUM, { value: contactTitle }) || nullOption

    this.setState({
      contactName,
      selectedIdOption,
      selectedTitleOption
    })
  }

  render () {
    return (
      <>
        <FormGroup>
          <Label for={`contactId${this.props.itemIndex}`}>Name from Database</Label>
          <OptimizedSelect
            styles={customStyles}
            maxMenuHeight={400}
            theme={theme}
            id={`contactId${this.props.itemIndex}`}
            value={this.state.selectedIdOption}
            onChange={this.handleIdChange}
            options={this.props.options}
            isClearable
            resetValue={nullOption}
          />
        </FormGroup>
        <FormGroup>
          <Label for={`contactName${this.props.itemIndex}`}>Editable Name</Label>
          <Input
            type='text'
            id={`contactName${this.props.itemIndex}`}
            value={this.state.contactName}
            onChange={this.handleNameChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for={`contactTitle${this.props.itemIndex}`}>Title for This</Label>
          <OptimizedSelect
            styles={customStyles}
            maxMenuHeight={400}
            theme={theme}
            id={`contactTitle${this.props.itemIndex}`}
            value={this.state.selectedTitleOption}
            onChange={this.handleTitleChange}
            options={CASTING_TITLES_ENUM}
            isClearable
            resetValue={nullOption}
          />
        </FormGroup>
      </>
    )
  }
}

SelectContactIdNameTitle.contextTypes = {
  updateCurrentValues: PropTypes.func
}

registerComponent({
  name: 'SelectContactIdNameTitle',
  component: SelectContactIdNameTitle
})
