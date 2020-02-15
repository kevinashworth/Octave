import { replaceComponent } from 'meteor/vulcan:lib'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React from 'react'
import { FormFeedback, Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap'

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

  let icon = <i className='icon-user' />
  switch (id) {
    case 'email':
      icon = '@'
      break
    case 'newPassword':
      icon = <i className='icon-key' />
      break
    case 'password':
      icon = <i className='icon-lock' />
      break
    default:
  }

  return (
    <InputGroup className='mb-3'>
      <InputGroupAddon addonType='prepend'>
        <InputGroupText>
          {icon}
        </InputGroupText>
      </InputGroupAddon>
      <Input
        id={id}
        type={type}
        innerRef={inputRef}
        onChange={onChange}
        placeholder={placeholder}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        invalid={invalid}
      />
      {invalid &&
        <FormFeedback><FormattedMessage id={messageId} /></FormFeedback>
      }
    </InputGroup>
  )
}

replaceComponent('FormControl', MyFormControl)

// from a Vulcan comment
// note: only used by old accounts package, remove soon?

// sign-up id's: username, email, password
// sign-in id's: usernameOrEmail, password
// forgot id: email
