import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap'
import { Meteor } from 'meteor/meteor'
import Users from 'meteor/vulcan:users'
import { withApollo } from 'react-apollo'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import { STATES } from 'meteor/vulcan:accounts'

class UsersMenu extends PureComponent {
  constructor (props) {
    super(props)
    this.toggle = this.toggle.bind(this)
    this.logOut = this.logOut.bind(this)
    this.state = {
      dropdownOpen: false
    }
  }

  toggle () {
    this.setState({ dropdownOpen: !this.state.dropdownOpen })
  }

  logOut () {
    Meteor.logout(() => {
      this.props.client.resetStore()
      window.location.reload()
    })
  }

  render () {
    const { currentUser, currentUserLoading, state } = this.props
    return (
      <div className='users-menu'>
        {currentUserLoading ? (
          <Components.Loading />
        ) : currentUser ? (
          <Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownToggle nav caret color='warning'>
              {Users.getDisplayName(currentUser)}
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem header tag='div' className='text-center'><strong>UserLoggedInMenu</strong></DropdownItem>
              <DropdownItem><NavLink to={`/users/${currentUser.slug}`}><FormattedMessage id='users.profile' /></NavLink></DropdownItem>
              <DropdownItem><NavLink to='/account'><FormattedMessage id='users.edit_account' /></NavLink></DropdownItem>
              {Users.isAdmin(currentUser) ? (
                <DropdownItem><NavLink to='/admin'>Users</NavLink></DropdownItem>
              ) : null}
              <DropdownItem onClick={this.logOut} tag='button'><FormattedMessage id='users.log_out' className='nav-link'/></DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <Components.Dropdown
            buttonProps={{ variant: 'btn-secondary' }}
            id='accounts-dropdown'
            className='users-account-menu'
            trigger={
              <div className='dropdown-toggle-inner'>
                <Components.Icon name='user' />
                <FormattedMessage id='users.sign_up_log_in' />
              </div>
            }
            menuContents={<Components.AccountsLoginForm formState={state ? STATES[state] : STATES.SIGN_IN} />}
          />
        )}
      </div>
    )
  }
}

UsersMenu.propsTypes = {
  currentUser: PropTypes.object,
  client: PropTypes.object
}

registerComponent({
  name: 'UsersMenu',
  component: UsersMenu,
  hocs: [withCurrentUser, withApollo]
})

// if (Users.isAdmin(currentUser)) {
//   menuItems.push({
//     to: `/admin`,
//     label: 'Users'
//   })
//
//   menuItems.push({
//     labelId: 'users.log_out',
//     itemProps: {
//       onClick: () => Meteor.logout(() => client.resetStore())
//     }
//   })
