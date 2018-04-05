import React, {Component} from 'react';
import {
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';

class ProjectDropdowns extends Component {

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
            Type
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Filter by type</DropdownItem>
            <DropdownItem><i className="fa fa-check"></i> Feature Film</DropdownItem>
            <DropdownItem><i className="fa fa-check"></i> Feature Film (LB)</DropdownItem>
            <DropdownItem><i className="fa fa-check"></i> Feature Film (MLB)</DropdownItem>
            <DropdownItem><i className="fa fa-fw"></i> Feature Film (ULB)</DropdownItem>
            <DropdownItem><i className="fa fa-check"></i> Pilot One Hour </DropdownItem>
            <DropdownItem><i className="fa fa-check"></i> Pilot 1/2 Hour </DropdownItem>
            <DropdownItem><i className="fa fa-check"></i> TV One Hour </DropdownItem>
            <DropdownItem><i className="fa fa-check"></i> TV Daytime </DropdownItem>
            <DropdownItem><i className="fa fa-check"></i> TV 1/2 Hour </DropdownItem>
            <DropdownItem><i className="fa fa-check"></i> TV Mini-Series </DropdownItem>
            <DropdownItem><i className="fa fa-check"></i> TV Movie </DropdownItem>
            <DropdownItem><i className="fa fa-check"></i> New Media (SVOD) </DropdownItem>
            <DropdownItem><i className="fa fa-check"></i> New Media (AVOD) </DropdownItem>
            <DropdownItem><i className="fa fa-fw"></i> New Media (&lt; $50k)</DropdownItem>
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
            Status
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Filter by status</DropdownItem>
            <DropdownItem><i className="fa fa-check"></i>Casting</DropdownItem>
            <DropdownItem><i className="fa fa-check"></i>On Hold</DropdownItem>
            <DropdownItem><i className="fa fa-fw"></i>Shooting</DropdownItem>
            <DropdownItem><i className="fa fa-check"></i>On Hiatus</DropdownItem>
            <DropdownItem><i className="fa fa-check"></i>See Notes</DropdownItem>
            <DropdownItem><i className="fa fa-check"></i>Unknown</DropdownItem>
            <DropdownItem header>Inactive</DropdownItem>
            <DropdownItem><i className="fa fa-fw"></i>Wrapped</DropdownItem>
            <DropdownItem><i className="fa fa-fw"></i>Canceled</DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
      </div>
    )
  }
}

export default ProjectDropdowns;
