import { registerComponent } from 'meteor/vulcan:lib'
import React, { PureComponent } from 'react'
import { FormGroup, Input, Label } from 'reactstrap'
import Select from 'react-virtualized-select'
import PropTypes from 'prop-types'

import pure from 'recompose/pure'
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys'
const OptimizedInput = pure(Input)
const OptimizedSelect = onlyUpdateForKeys(['value'])(Select)

/**
* This version explicity for contactId, contactName, contactTitle
* Also working on a DRY component called (for now) SelectIdGenericWIP.jsx
*/

class SelectContactIdNameTitle extends PureComponent {
  constructor (props) {
    super(props)

    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)

    const nestedFields = Object.keys(this.props.nestedSchema)
    const contacts = this.props.document.contacts
    const itemIndex = this.props.itemIndex
    const contactName = contacts[itemIndex] ? contacts[itemIndex].contactName : ''
    const contactTitle = contacts[itemIndex] ? contacts[itemIndex].contactTitle : ''

    this.state = {
      selectField: nestedFields.shift(), // get first field, shift remaining
      indexFields: nestedFields,
      value: this.props.value,
      path: this.props.path,
      pathPrefix: this.props.parentFieldName + '.' + this.props.itemIndex + '.',
      contactName: contactName,
      contactTitle: contactTitle
    }
  }

  handleSelectChange = (value) => {
    this.setState({
      value,
      contactName: value.label
    })
    this.context.updateCurrentValues({
      [this.state.path]: value.value,
      [this.state.pathPrefix + 'contactName']: value.label
    })
  }

  handleInputChange = ({ target }) => {
    this.setState({
      [target.id]: target.value
    })
    const path = this.state.pathPrefix + target.id
    this.context.updateCurrentValues({
      [path]: target.value
    })
  }

  render () {
    return (
      <div>
        <FormGroup>
          <Label for='contactId'>Contact's Name from Database</Label>
          <OptimizedSelect
            id='contactId'
            value={this.state.value}
            onChange={this.handleSelectChange}
            options={this.props.options}
            resetValue={{ value: null, label: '' }}
          />
        </FormGroup>
        <FormGroup>
          <Label for='contactName'>Editable Contact Name</Label>
          <OptimizedInput
            type='text'
            id='contactName'
            value={this.state.contactName}
            onChange={this.handleInputChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for='contactTitle'>Contact's Title for This Project</Label>
          <OptimizedInput
            type='text'
            id='contactTitle'
            value={this.state.contactTitle}
            onChange={this.handleInputChange}
            required
          />
        </FormGroup>
      </div>
    )
  }
}

SelectContactIdNameTitle.contextTypes = {
  updateCurrentValues: PropTypes.func
}

registerComponent('SelectContactIdNameTitle', SelectContactIdNameTitle)
