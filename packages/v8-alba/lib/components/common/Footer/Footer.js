import { registerComponent } from 'meteor/vulcan:core';
import React, {Component} from 'react';

class Footer extends Component {
  render() {
    return (
      <footer className="app-footer">
        <span><a href="https://genesisui.com">Alba</a> &copy; 2018 creativeLabs.</span>
        <span className="ml-auto">Powered by <a href="https://genesisui.com">GenesisUI</a></span>
      </footer>
    )
  }
}

registerComponent('Footer', Footer);
