import { Components, registerComponent } from 'meteor/vulcan:core';
import React from 'react';

const OfficesSingle = (props, context) => {
  return <Components.OfficesDetail documentId={props.params._id} slug={props.params.slug} />
};

OfficesSingle.displayName = "OfficesSingle";

registerComponent('OfficesSingle', OfficesSingle);
