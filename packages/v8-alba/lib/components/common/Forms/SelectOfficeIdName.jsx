import { registerComponent } from 'meteor/vulcan:lib'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { FormGroup, Input, Label } from 'reactstrap'
import Select from 'react-select'
import _ from 'lodash'
import { customStyles, theme } from './react-select-settings'

import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys'
const OptimizedSelect = onlyUpdateForKeys(['value'])(Select)

/**
* This version explicity for officeId, officeName
* TODO: a DRY component of this to not repeat all this code in SelectOfficeIdName.jsx
*/

class SelectOfficeIdName extends PureComponent {
  constructor (props) {
    super(props)

    this.handleIdChange = this.handleIdChange.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)

    this.state = {
      path: this.props.path,
      pathPrefix: this.props.parentFieldName + '.' + this.props.itemIndex + '.',
      officeId: this.props.value,
      officeName: '',
      selectedIdOption: null,
    }
  }

  handleIdChange (selectedOption) {
    this.setState({
      officeId: selectedOption.value,
      officeName: selectedOption.label,
      selectedIdOption: selectedOption
    })
    this.context.updateCurrentValues({
      [this.state.path]: selectedOption.value,
      [this.state.pathPrefix + 'officeName']: selectedOption.label
    })
  }

  handleNameChange ({ target }) {
    this.setState({
      officeName: target.value
    })
    this.context.updateCurrentValues({
      [this.state.pathPrefix + 'officeName']: target.value
    })
  }

  componentDidMount () {
    const projects = this.props.document.projects
    const officeName = projects[this.props.itemIndex] ? projects[this.props.itemIndex].officeName : ''
    const selectedIdOption = _.find(this.props.options, { value: this.props.value }) || null

    this.setState({
      officeName,
      selectedIdOption
    })
  }

  render () {
    return (
      <>
        <FormGroup>
          <Label for={`officeId${this.props.itemIndex}`}>Office</Label>
          <OptimizedSelect
            styles={customStyles}
            maxMenuHeight={400}
            theme={theme}
            id={`officeId${this.props.itemIndex}`}
            value={this.state.selectedIdOption}
            onChange={this.handleIdChange}
            options={this.props.options}
            isClearable
            resetValue={{ value: null, label: '' }}
          />
        </FormGroup>
        <FormGroup>
          <Label for={`officeName${this.props.itemIndex}`}>Editable Name</Label>
          <Input
            type='text'
            id={`officeName${this.props.itemIndex}`}
            value={this.state.officeName}
            onChange={this.handleNameChange}
          />
        </FormGroup>
      </>
    )
  }
}

SelectOfficeIdName.contextTypes = {
  updateCurrentValues: PropTypes.func
}

registerComponent({
  name: 'SelectOfficeIdName',
  component: SelectOfficeIdName
})
