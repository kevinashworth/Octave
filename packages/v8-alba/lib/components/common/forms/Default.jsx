import React from 'react';
import { Input } from 'formsy-react-components';
import { replaceComponent } from 'meteor/vulcan:core';

const MyDefault = ({refFunction, inputProperties}) => 
  <Input {...inputProperties} ref={refFunction} type="text" />;

replaceComponent('FormComponentDefault', MyDefault);
