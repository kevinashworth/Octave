import { registerComponent } from 'meteor/vulcan:lib'
import { intlShape } from 'meteor/vulcan:i18n'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CreatableSelect from 'react-select/creatable';

class MyDatalist extends Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleChange = (newValue, actionMeta) => {
    // if (!newValue) {
    //   this.context.updateCurrentValues({ [this.props.path]: null })
    //   return
    // }
    console.group('Value Changed');
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();

    if (actionMeta.action === 'create-option') {
      this.context.updateCurrentValues({
        [this.props.path]: newValue.value
      })
    }
    if (actionMeta.action === 'select-option') {
      this.context.updateCurrentValues({
        [this.props.path]: newValue.label
      })
    }

  };
  handleInputChange = (inputValue, actionMeta) => {
    console.group('Input Changed');
    console.log(inputValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
  };

  componentDidMount () {
    // if it's one of the values in the system
    let selectedOption = find(this.props.options, { value: this.props.value })
    // if it's a value the user has input
    if (!selectedOption) {
      selectedOption = { value: this.props.value, label: this.props.value }
    }
    if (selectedOption) {
      this.context.updateCurrentValues({
        [this.props.path]: selectedOption.value
      })
    }
  }

  render() {
    // if it's one of the values in the system
    let selectedOption = find(this.props.options, { value: this.props.value })
    // if it's a value the user has input
    if (!selectedOption) {
      selectedOption = { value: this.props.value, label: this.props.value }
    }
    const noneOption = {
      label: this.context.intl.formatMessage({ id: 'forms.select_option' }),
      value: null,
      isDisabled: true
    }
    return (
      <div className='form-group row'>
        <label className='form-label col-form-label col-sm-3'>{this.props.label}</label>
        <div className='col-sm-9'>
        <CreatableSelect
          isClearable
          onChange={this.handleChange}
          onInputChange={this.handleInputChange}
          defaultValue={{ value: null, label: '' }}
          options={[noneOption, ...this.props.options]}
          value={selectedOption}
        />
        </div>
      </div>
    );
  }
}

MyDatalist.contextTypes = {
  updateCurrentValues: PropTypes.func,
  intl: intlShape
}

registerComponent({
  name: 'MyDatalist',
  component: MyDatalist
})
