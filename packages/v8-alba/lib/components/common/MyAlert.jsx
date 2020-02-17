import { replaceComponent } from 'meteor/vulcan:lib'
import React from 'react'
import { UncontrolledAlert } from 'reactstrap'

const MyAlert = ({ children, variant,  ...rest }) =>
  <UncontrolledAlert color={variant} {...rest}>{children}</UncontrolledAlert>

replaceComponent('Alert', MyAlert)
