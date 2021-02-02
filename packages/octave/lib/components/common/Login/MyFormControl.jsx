import { replaceComponent } from 'meteor/vulcan:lib'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React from 'react'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'

const MyFormControl = (props) => {
  const {
    autoComplete,
    defaultValue,
    id,
    inputRef,
    invalid,
    messageId,
    onChange,
    placeholder,
    type
  } = props

  let icon = <i className='fal fa-user' />
  switch (id) {
    case 'email':
      icon = <i className='fal fa-at' />
      break
    case 'newPassword':
      icon = <i className='fal fa-key' />
      break
    case 'password':
      icon = <i className='fal fa-lock' />
      break
    default:
  }

  return (
    <InputGroup className='mb-3'>
      <InputGroup.Prepend>
        <InputGroup.Text>
          {icon}
        </InputGroup.Text>
      </InputGroup.Prepend>
      <FormControl
        id={id}
        type={type}
        ref={inputRef}
        onChange={onChange}
        placeholder={placeholder}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        isInvalid={invalid}
      />
      {invalid &&
        <FormControl.Feedback type='invalid'><FormattedMessage id={messageId} /></FormControl.Feedback>}
    </InputGroup>
  )
}

replaceComponent('FormControl', MyFormControl)

// from a Vulcan comment
// note: only used by old accounts package, remove soon?

// sign-up id's: username, email, password
// sign-in id's: usernameOrEmail, password
// forgot id: email
