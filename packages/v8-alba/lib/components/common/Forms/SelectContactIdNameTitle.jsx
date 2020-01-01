import { registerComponent } from 'meteor/vulcan:lib'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, FormGroup, Input, Label } from 'reactstrap'
import Select from 'react-select'
import _ from 'lodash'
import { CASTING_TITLES_ENUM } from '../../../modules/constants.js'

import pure from 'recompose/pure'
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys'
const OptimizedInput = pure(Input)
const OptimizedSelect = onlyUpdateForKeys(['value'])(Select)

/**
* This version explicity for contactId, contactName, contactTitle
* TODO: a DRY component of this to not repeat all this code in SelectProjectIdNameTitle.jsx
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
      contactId: this.props.value
    }
  }

  handleIdChange (selectedOption) {
    console.log('Option selected:', selectedOption)
    this.setState({
      contactId: selectedOption.value,
      contactName: selectedOption.label
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
      contactTitle: selectedOption.label
    })
    this.context.updateCurrentValues({
      [this.state.pathPrefix + 'contactTitle']: selectedOption.label
    })
  }

  render () {
    const contacts = this.props.document.contacts
    const itemIndex = this.props.itemIndex
    const contactName = contacts[itemIndex] ? contacts[itemIndex].contactName : ''
    const contactTitle = contacts[itemIndex] ? contacts[itemIndex].contactTitle : ''
    const selectedIdOption = _.find(this.props.options, { value: this.props.value }) || null
    const selectedTitleOption = _.find(CASTING_TITLES_ENUM, { value: contactTitle }) || null

    return (
      <Form>
        <FormGroup>
          <Label for={`contactId${itemIndex}`}>Name from Database</Label>
          <OptimizedSelect
            id={`contactId${itemIndex}`}
            value={selectedIdOption}
            onChange={this.handleIdChange}
            options={this.props.options}
            isClearable
            resetValue={{ value: null, label: '' }}
          />
        </FormGroup>
        <FormGroup>
          <Label for={`contactName${itemIndex}`}>Editable Name</Label>
          <OptimizedInput
            type='text'
            id={`contactName${itemIndex}`}
            value={contactName}
            onChange={this.handleNameChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for={`contactTitle${itemIndex}`}>Title for This</Label>
          <OptimizedSelect
            id={`contactTitle${itemIndex}`}
            value={selectedTitleOption}
            onChange={this.handleTitleChange}
            options={CASTING_TITLES_ENUM}
            isClearable
            resetValue={{ value: null, label: '' }}
          />
        </FormGroup>
      </Form>
    )
  }
}

SelectContactIdNameTitle.contextTypes = {
  updateCurrentValues: PropTypes.func
}

registerComponent('SelectContactIdNameTitle', SelectContactIdNameTitle)
