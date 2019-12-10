import { Components, registerComponent, withCurrentUser, withMessages, withSingle2 } from 'meteor/vulcan:core';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import Users from 'meteor/vulcan:users';
import { STATES } from 'meteor/vulcan:accounts';
import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

const UsersEditForm = ({ document: user, currentUser, flash, history, loading, toggle }) => {

  if (loading) {
    return <Components.Loading />;
  }

  return Users.canUpdate({ collection: Users, document: user, user: currentUser }) ? (
    <div className="page users-edit-form">
      <h2 className="page-title users-edit-form-title">
        <FormattedMessage id="users.edit_account" />
      </h2>

      <div className="change-password-link">
        <Components.ModalTrigger
          size="small"
          title={<FormattedMessage id="accounts.change_password" />}
          component={
            <a href="#">
              <FormattedMessage id="accounts.change_password" />
            </a>
          }
        >
          <Components.AccountsLoginForm formState={STATES.PASSWORD_CHANGE} />
        </Components.ModalTrigger>
      </div>

      <Components.SmartForm
        documentId={user._id}
        collection={Users}
        successCallback={user => {
          if (toggle) {
            toggle()
          } else if (user.slug) {
            history.push(`/users/${user.slug}`)
          } else {
            history.push('/admin')
          }
          flash({ id: 'users.edit_success', properties: { name: Users.getDisplayName(user) }, type: 'success' });
        }}
        cancelCallback={document => {
          if (toggle) {
            toggle()
          } else {
            history.push(`/users/${user.slug}`)
          }
        }}
        showRemove={true}
      />
    </div>
  ) : (
    <FormattedMessage id="app.noPermission" />
  );
};

UsersEditForm.propTypes = {
  terms: PropTypes.object, // a user is defined by its unique _id or its unique slug
};

UsersEditForm.displayName = 'UsersEditForm';

const options = {
  collection: Users,
  fragmentName: 'UsersProfile',
};

registerComponent({
  name: 'UsersEditForm',
  component: UsersEditForm,
  hocs: [withMessages, withCurrentUser, withRouter, [withSingle2, options]],
});
