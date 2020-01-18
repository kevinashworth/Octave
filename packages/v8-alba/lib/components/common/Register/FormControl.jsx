import { replaceComponent } from 'meteor/vulcan:lib'
import React from 'react'
import { Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap'

const MyFormControl = ({ id }) => {
  let icon = <i className='icon-user'></i>
  let placeholder = 'Username'
  let type = 'text'
  let autocomplete = 'email'
  if (id ==='password') {
    icon = <i className="icon-lock"></i>
    placeholder = 'Password'
    type = 'password'
    autocomplete = 'current-password'
  }
  return (
  <InputGroup className="mb-3">
    <InputGroupAddon addonType="prepend">
      <InputGroupText>
        {icon}
      </InputGroupText>
    </InputGroupAddon>
    <Input type={type} placeholder={placeholder} autoComplete={autocomplete} />
  </InputGroup>
)}

replaceComponent('FormControl', MyFormControl);

// from a Vulcan comment
// note: only used by old accounts package, remove soon?
