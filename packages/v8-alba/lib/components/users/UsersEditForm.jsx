import { Components, getFragment, registerComponent, withCurrentUser, withMessages, withSingle2 } from 'meteor/vulcan:core'
import { FormattedMessage, intlShape } from 'meteor/vulcan:i18n'
import Users from 'meteor/vulcan:users'
import { STATES } from 'meteor/vulcan:accounts'
import React, { PureComponent, useMemo, useRef } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Button, Card, CardBody, CardTitle, Col, FormGroup, FormText, Label, Row } from 'reactstrap'
import Select from 'react-select'
import { nullOption } from '../../modules/constants.js'

function UsersEditForm (props, context) {
  const { document: user, currentUser, flash, history, loading, toggle } = props
  if (loading) {
    return <Components.Loading />
  }
  if (!Users.canUpdate({ collection: Users, document: user, user: currentUser })) {
    return <FormattedMessage id='app.noPermission' />
  }

  // See https://github.com/JedWatson/react-select/issues/3603#issuecomment-591511367
  const isFocusedRef = useRef(false);
  const customStyles = useMemo(
    () => ({
      container: (base, state) => {
        isFocusedRef.current = state.isFocused;
        return {
          ...base,
          display: 'inline-block'
        };
      },
      placeholder: (base, state) => {
        return {
          ...base,
          ...(isFocusedRef.current && state.value
            ? {}
            : {
                position: 'static',
                top: 'auto',
                transform: 'none'
              })
        };
      },
      input: (base, state) => {
        return {
          ...base,
          ...(isFocusedRef.current && state.value
            ? {}
            : {
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)'
              })
        };
      },
      singleValue: (base, state) => {
        return {
          ...base,
          maxWidth: 'none',
          ...(isFocusedRef.current && state.value
            ? {}
            : {
                position: 'static',
                top: 'auto',
                transform: 'none'
              })
        };
      }
    }),
    []
  );

  function emailNewSuccessCallback ({ handle }) {
    props.flash({
      id: 'users.add_email_success',
      properties: { handle },
      type: 'success'
    })
  }

  function handlePrimaryEmail (event) {
    console.log('handlePrimaryEmail:')
    console.dir(event.target)
  }

  const emailOptions = [
    nullOption,
    ...user.handles.map(handle => ({ value: handle.address, label: handle.address }))
  ]

  return (
    <div className='animated fadeIn page users-edit-form'>
      <Components.HeadTags title={`V8: ${context.intl.formatMessage({ id: 'users.edit_account' })}`} />
      <Card className='card-accent-success'>
        <CardBody>
          <CardTitle>{user.displayName}</CardTitle>
            <hr />
            <Row>
              <Col>
                {user.handles &&
                  user.handles.length > 0 &&
                  <CardTitle><b>Emails</b></CardTitle>}
                {user.handles &&
                  user.handles.map(handle => <Components.EmailSingle key={handle.address} handle={handle} user={user} />)
                }
                <FormGroup>
                  <Label for='emailSelect'><b>Primary email address</b></Label>
                  <FormText tag='p' className='pt-0'>
                    <b>kevinashworth@yahoo.com</b> will be used for account-related notifications and can be used for password resets.
                  </FormText>
                  <Row form>
                    <Col xs={8}>
                      <Select options={emailOptions} styles={customStyles} />
                    </Col>
                    <Col xs={2}>
                      <Button onClick={handlePrimaryEmail}>Save</Button>
                    </Col>
                  </Row>
                </FormGroup>
                <Components.ModalTrigger
                  component={<Button><FormattedMessage id='users.add_email' /></Button>}>
                  <Components.EmailNewForm
                    user={user}
                    successCallback={emailNewSuccessCallback}
                  />
                </Components.ModalTrigger>
            </Col>
          </Row>
          <Row>
            <Col>
              <Components.ModalTrigger
                title={<FormattedMessage id='accounts.change_password' />}
                component={
                  <Button className='btn-warning'>
                    <FormattedMessage id='accounts.change_password' />
                  </Button>
                }
              >
                <Components.AccountsLoginForm formState={STATES.PASSWORD_CHANGE} />
              </Components.ModalTrigger>
            </Col>
          </Row>
          <hr />
          <Components.SmartForm
            documentId={user._id}
            collection={Users}
            queryFragment={getFragment('UsersEditFragment')}
            mutationFragment={getFragment('UsersEditFragment')}
            fields={[
              'displayName',
              'username',
              'twitterUsername',
              'bio',
              'website',
              'notifications_comments',
              'notifications_posts',
              'notifications_replies',
              'notifications_users',
              'isAdmin'
            ]}
            successCallback={user => {
              if (toggle) {
                toggle()
              } else if (user.slug) {
                history.push(`/users/${user.slug}`)
              } else {
                history.push('/admin')
              }
              flash({
                id: 'users.edit_success',
                properties: { name: Users.getDisplayName(user) },
                type: 'success'
              })
            }}
            cancelCallback={document => {
              if (toggle) {
                toggle()
              } else {
                history.push(`/users/${user.slug}`)
              }
            }}
            showRemove
          />
        </CardBody>
      </Card>
    </div>
  )
}

UsersEditForm.propTypes = {
  terms: PropTypes.object, // a user is defined by its unique _id or its unique slug
  flash: PropTypes.func
}

UsersEditForm.contextTypes = {
  intl: intlShape
}

UsersEditForm.displayName = 'UsersEditForm'

const options = {
  collection: Users,
  fragmentName: 'UsersProfile'
}

registerComponent({
  name: 'UsersEditForm',
  component: UsersEditForm,
  hocs: [withMessages, withCurrentUser, withRouter, [withSingle2, options]]
})
