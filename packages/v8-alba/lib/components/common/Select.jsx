import { registerComponent } from 'meteor/vulcan:lib';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'formsy-react-components';

class MyCustomFormComponent extends PureComponent {

  constructor() {
    super();
    this.toggleMessage = this.toggleMessage.bind(this);
    this.state = {
      contactId: 'foo'
    };
  }

  toggleMessage() {
    this.setState({
      contactId: this.state.contactId === 'foo' ? 'bar' : 'foo'
    });
    this.context.updateCurrentValues({contactId: this.state.contactId});
  }

  render() {

    return (
      <div className="form-group row">
        <label className="control-label col-sm-3">{this.props.label}</label>
        <div className="col-sm-9">
          <p>contactId is: {this.state.contactId}</p>
          <a onClick={this.toggleMessage}>Toggle contactId</a>
          <Input type="hidden" name="contactId" value={this.state.contactId}/>
        </div>
      </div>
    );
  }
}

MyCustomFormComponent.contextTypes = {
  updateCurrentValues: PropTypes.func,
};

registerComponent('MyCustomFormComponent', MyCustomFormComponent);
