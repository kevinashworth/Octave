import { registerComponent } from 'meteor/vulcan:lib';
import React, { PureComponent } from 'react';
import { FormGroup, Input, Label } from 'reactstrap'
import Select from 'react-select';
import PropTypes from 'prop-types';

/**
* This version explicity for contactId, contactName, contactTitle, only
* Also working on a DRY component called for now SelectIdGenericWIP.jsx
*/

class SelectContactIdNameTitle extends PureComponent {
  constructor(props) {
    super(props);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    const unshifted = Object.keys(this.props.nestedSchema);
    this.state = {
      selectField: unshifted.shift(),  // get first item, shift remaining
      indexFields: unshifted,
      value: this.props.value,
      path: this.props.path,
      pathPrefix: this.props.parentFieldName + "." + this.props.itemIndex + ".",
      contactName: "contactName will autopopulate",
      contactTitle: "contactTitle goes here",
    };
  }

  handleSelectChange = (value) => {
    this.setState({
      value,
      contactName: value.label
    });
    console.log(`Selected label: ${value.label}\nSelected value: ${value.value}`);
    console.log(`this.state.path: ${this.state.path}`);
    this.context.updateCurrentValues({
      [this.state.path]: value.value,
      [this.state.pathPrefix + 'contactName']: value.label
    });
    debugger;
  }

  handleInputChange = ({target}) => {
    this.setState({
      [target.id]: target.value
    });
    console.log('setState ' + target.id + ':', target.value);
    const path = this.state.pathPrefix + target.id; //TODO - improveable?
    this.context.updateCurrentValues({
      [path]: target.value
    })
  }

  render() {
    return (
      <FormGroup>
        <Label for={this.state.selectField}>{this.state.selectField}</Label>
          <Select
            id={this.state.selectField}
            value={this.state.value}
            onChange={this.handleSelectChange}
            options={this.props.options}
            resetValue={{ value: null, label: '' }}
          />
        <Label for="contactName">contactName</Label>
        <Input
          type="text"
          id="contactName"
          value={this.state.contactName}
          onChange={this.handleInputChange}
          required
        />
        <Label for="contactTitle">contactTitle</Label>
        <Input
          type="text"
          id="contactTitle"
          value={this.state.contactTitle}
          onChange={this.handleInputChange}
          required
        />
      </FormGroup>

    );
  }
}

SelectContactIdNameTitle.contextTypes = {
  updateCurrentValues: PropTypes.func,
};

registerComponent('SelectContactIdNameTitle', SelectContactIdNameTitle);
