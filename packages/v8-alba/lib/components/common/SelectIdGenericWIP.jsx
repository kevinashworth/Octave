import { registerComponent } from 'meteor/vulcan:lib';
import React, { PureComponent } from 'react';
import { FormGroup, Input, Label } from 'reactstrap'
import Select from 'react-select';
import PropTypes from 'prop-types';

/**
* nestedSchema assumption: first field is a Select form field (the _id part), remaining are text Inputs (name, title, etc.)
*/

class SelectIdGenericWIP extends PureComponent {
  constructor(props) {
    super(props);
    // this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    const unshifted = Object.keys(this.props.nestedSchema);
    this.state = {
      selectField: unshifted.shift(),  // get first item, shift remaining
      indexFields: unshifted,
      value: this.props.value,
      path: this.props.path,
      altPath: this.props.parentFieldName + "." + this.props.itemIndex + "." + this.props.inputProperties.name,
      // contactName: "contactName will autopopulate",
      // contactTitle: "contactTitle goes here",
      inputVal: {
        contactName: "contactName will autopopulate",
        contactTitle: "contactTitle goes here"
      }
    };
  }

  handleSelectChange = (value) => {
    const xyz = this.state.indexFields[0];
    this.setState({
      value,
      xyz: value.label
    });
    console.log(`Selected label: ${value.label}\nSelected value: ${value.value}`);
    console.log(`this.state.path: ${this.state.path}`);
    this.context.updateCurrentValues({
      [this.state.path]: value.value
    });
    debugger;
  }

  // handleInputChange = (e) => {
  //   this.setState({
  //     [e.target.id]: e.target.value
  //   });
  //   console.log('setState ' + e.target.id + ':', e.target.value);
  //   const path = 'contacts.0.' + e.target.id;
  //   this.context.updateCurrentValues({
  //     [path]: e.target.value
  //   })
  // }

  handleInputChange = (idx, {target}) => {
    this.setState(({inputVal}) => {
      Object.keys(inputVal)[idx] = target.value;
      return inputVal;
    });
    const path = 'contacts.0.' + target.id; //TODO
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
        {/* <Label for="contactName">contactName</Label>
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
        /> */}
        {this.state.indexFields.map((indexField, i) => {
           return (
           <div key={i}>
             <Label for={indexField}>{indexField}</Label>
             <Input
               type="text"
               id={indexField}
               value={this.state.inputVal[i] || ""}
               onChange={this.handleInputChange.bind(this, i)}
               required
             />
           </div>
         )
         })}
      </FormGroup>

    );
  }
}

SelectIdGenericWIP.contextTypes = {
  updateCurrentValues: PropTypes.func,
};

registerComponent('SelectIdGenericWIP', SelectIdGenericWIP);
