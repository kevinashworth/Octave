import { registerComponent } from 'meteor/vulcan:lib'
import React, { PureComponent } from 'react'
import { FormGroup, Input, Label } from 'reactstrap'
import Select from 'react-virtualized-select'
import PropTypes from 'prop-types'
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
    }
  }

  handleIdChange (value) {
    this.setState({
      value,
      contactName: value.label
    })
    this.context.updateCurrentValues({
      [this.state.path]: value.value,
      [this.state.pathPrefix + 'contactName']: value.label
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
      contactTitle: value.label
    })
    this.context.updateCurrentValues({
      [this.state.pathPrefix + 'contactTitle']: value.label
    })
  }

  render () {
    const contacts = this.props.document.contacts
    const itemIndex = this.props.itemIndex
    const contactName = contacts[itemIndex] ? contacts[itemIndex].contactName : ''
    const contactTitle = contacts[itemIndex] ? contacts[itemIndex].contactTitle : ''
    const value = this.props.value

    return (
      <div>
        <FormGroup>
          <Label for={`contactId${itemIndex}`}>Name from Database</Label>
          <OptimizedSelect
            id={`contactId${itemIndex}`}
            value={value}
            onChange={this.handleIdChange}
            options={this.props.options}
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
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for={`contactTitle${itemIndex}`}>Title for This</Label>
          <OptimizedSelect
            id={`contactTitle${itemIndex}`}
            value={contactTitle}
            onChange={this.handleTitleChange}
            options={CASTING_TITLES_ENUM}
            resetValue={{ value: null, label: '' }}
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
