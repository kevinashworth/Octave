import { registerComponent } from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import {
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';

class ContactDropdowns extends PureComponent {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: new Array(3).fill(false)
    };
  }

  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => { return (index === i ? !element : false); });
    this.setState({
      dropdownOpen: newArray
    });
  }

  render() {
    return (
      <div className="float-right">
        <ButtonDropdown className="ml-2" isOpen={this.state.dropdownOpen[0]} toggle={() => { this.toggle(0); }}>
          <DropdownToggle caret>
            Title
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Filter by title</DropdownItem>
            <DropdownItem><i className="fa fa-check"></i>Casting Director</DropdownItem>
            <DropdownItem><i className="fa fa-check"></i>Casting Associate</DropdownItem>
            <DropdownItem><i className="fa fa-check"></i>Casting Assistant</DropdownItem>
            <DropdownItem><i className="fa fa-fw"></i>Other</DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
        <ButtonDropdown className="ml-2" isOpen={this.state.dropdownOpen[1]} toggle={() => { this.toggle(1); }}>
          <DropdownToggle caret>
            Last updated
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Filter by last updated</DropdownItem>
            <DropdownItem><i className="fa fa-fw"></i>One Day</DropdownItem>
            <DropdownItem><i className="fa fa-fw"></i>One Week</DropdownItem>
            <DropdownItem><i className="fa fa-check"></i>Two Weeks</DropdownItem>
            <DropdownItem><i className="fa fa-fw"></i>One Month</DropdownItem>
            <DropdownItem><i className="fa fa-fw"></i>Two Months</DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
        <ButtonDropdown className="ml-2" isOpen={this.state.dropdownOpen[2]} toggle={() => { this.toggle(2); }}>
          <DropdownToggle caret>
            Location?
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Filter by type</DropdownItem>
            <DropdownItem><i className="fa fa-check"></i> Dummy</DropdownItem>
            <DropdownItem><i className="fa fa-check"></i> Dummy</DropdownItem>
            <DropdownItem><i className="fa fa-check"></i> Dummy</DropdownItem>
            <DropdownItem><i className="fa fa-fw"></i> Foo</DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
    </div>
    )
  }
}

registerComponent('ContactDropdowns', ContactDropdowns);
