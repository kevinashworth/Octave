import { Components } from 'meteor/vulcan:core';
import React, { Component } from 'react';
import { DropdownMenu, DropdownToggle, Nav } from 'reactstrap';
import PropTypes from 'prop-types';

import { AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
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
          <AppHeaderDropdown>
            <DropdownToggle nav>
              <i className  ='icon-user font-2xl' />
            </DropdownToggle>
            <DropdownMenu right>
              <Components.UsersMenu />
            </DropdownMenu>
          </AppHeaderDropdown>
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
