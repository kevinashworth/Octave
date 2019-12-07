import { replaceComponent } from 'meteor/vulcan:lib'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap'

/*
A node contains a menu item, and optionally a list of child items
*/
const Node = ({ childrenItems, ...rest }) => {
  return (
    <Fragment>
      <Item {...rest} />
      {childrenItems &&
        !!childrenItems.length && (
          <div className="menu-node-children">{childrenItems.map((item, index) => <Item key={index} {...item} />)}</div>
        )}
    </Fragment>
  );
};

Node.propTypes = {
  childrenItems: PropTypes.array, // an array of dropdown items used as children of the current item
};

/*
Note: `rest` is used to ensure auto-generated props from parent dropdown
components are properly passed down to MenuItem
*/
const Item = ({ index, to, labelId, label, component, componentProps = {}, itemProps, linkProps, ...rest }) => {
  let menuComponent;

  if (component) {
    menuComponent = React.cloneElement(component, componentProps);
  } else if (labelId) {
    menuComponent = <FormattedMessage id={labelId} />;
  } else {
    menuComponent = <span>{label}</span>;
  }

  const item = (
    <DropdownItem {...itemProps} {...rest}>
      {menuComponent}
    </DropdownItem>
  );

  return to ? <NavLink to={to} {...linkProps}>{item}</NavLink> : item;
};

Item.propTypes = {
  index: PropTypes.number, // index
  to: PropTypes.any, // a string or object, used to generate the router path for the menu item
  labelId: PropTypes.string, // an i18n id for the item label
  label: PropTypes.string, // item label string, used if id is not provided
  component: PropTypes.object, // a component to use as menu item
  componentProps: PropTypes.object, // props passed to the component
  itemProps: PropTypes.object, // props for the <MenuItem/> component
};

const MyDropdown = ({ label, labelId, trigger, menuItems, menuContents, variant = 'dropdown', buttonProps, ...dropdownProps }) => {
  const menuBody = menuContents ? menuContents : menuItems.map((item, index) => {
    if (item === 'divider') {
      return <DropdownItem divider key={index} />;
    } else {
      return <Node {...item} key={index} index={index} />;
    }
  });

  if (variant === 'flat') {

    return menuBody;

  } else {
    if (trigger) {
      // if a trigger component has been provided, use it
      return (
        <Dropdown {...dropdownProps}>
          <DropdownToggle>{trigger}</DropdownToggle>
          <DropdownMenu>{menuBody}</DropdownMenu>
        </Dropdown>
      );
    } else {
      // else default to DropdownButton
      return (
        <DropdownButton {...buttonProps} title={labelId ? <FormattedMessage id={labelId} /> : label} {...dropdownProps}>
          {menuBody}
        </DropdownButton>
      );
    }
  }
};

MyDropdown.propTypes = {
  labelId: PropTypes.string, // menu title/label i18n string
  label: PropTypes.string, // menu title/label
  trigger: PropTypes.object, // component used as menu trigger (the part you click to open the menu)
  menuContents: PropTypes.object, // a component specifying the menu contents
  menuItems: PropTypes.array, // an array of menu items, used if menuContents is not provided
  variant: PropTypes.string, // dropdown (default) or flat
  buttonProps: PropTypes.object, // props specific to the dropdown button
};

replaceComponent('Dropdown', MyDropdown)
