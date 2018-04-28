import { Components, registerComponent, withCurrentUser, withDocument } from 'meteor/vulcan:core';
import React, { Component } from "react";
import { Badge, ListGroupItem } from "reactstrap";
import moment from 'moment';
import { DATE_FORMAT_SHORT } from '../../modules/constants.js';
import Offices from '../../modules/offices/collection.js';

const OfficesItem = ({loading, document, currentUser}) => {
  if (loading) {
    return (
      <tr></tr>
    )
  } else {
    const office = document;
    const badge = office.projectIds ? office.projectIds.length : null;
    const displayDate = office.updatedAt ?
      "Last modified " + moment(office.updatedAt).format(DATE_FORMAT_SHORT) :
      "Created " + moment(office.createdAt).format(DATE_FORMAT_SHORT);

    return (
      <ListGroupItem tag="a" action href={office.href}>
        {office.displayName} <Badge color="success" pill>{badge}</Badge>
        &nbsp; <small>{displayDate}</small>
      </ListGroupItem>
    );
  }
}

const options = {
  collection: Offices,
  queryName: 'officesSingleQuery',
  fragmentName: 'OfficesDetailsFragment',
};

registerComponent('OfficesItem', OfficesItem, withCurrentUser, [withDocument, options]);
