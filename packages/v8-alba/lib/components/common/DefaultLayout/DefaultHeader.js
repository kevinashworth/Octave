import { Components } from 'meteor/vulcan:core';
import React, { Component } from 'react';
import { Dropdown, DropdownMenu, DropdownToggle, Nav } from 'reactstrap';
import PropTypes from 'prop-types';

import { AppNavbarBrand, AppSidebarToggler } from '@coreui/react';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dropdownOpen: false
    }
    this.toggle = this.toggle.bind(this)
  }

  toggle () {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    })
  }

  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: '/img/brand/logo-pro.svg', width: 89, height: 25, alt: 'Logo' }}
          minimized={{ src: '/img/brand/sygnet-pro.svg', width: 30, height: 30, alt: 'Sygnet' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />
        <Nav className="ml-auto" navbar>
          <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} nav>
            <DropdownToggle nav>
              <i className  ='icon-user font-2xl' />
            </DropdownToggle>
            <DropdownMenu right>
              <Components.UsersMenu />
            </DropdownMenu>
          </Dropdown>
        </Nav>
        {/*<AppAsideToggler className="d-md-down-none" />
        <AppAsideToggler className="d-lg-none" mobile />*/}
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
