import React, { Component } from "react";
import { Badge, ListGroupItem } from "reactstrap";

class OfficesItem extends Component {
  render() {
    const { office } = this.props;
    if (office._id % 2) {
      return (
        <ListGroupItem tag="a" action href={office.href}>
          {office.text} <Badge pill>{office.badge}</Badge>
        </ListGroupItem>
      );
    } else {
      return (
        <ListGroupItem color="secondary" tag="a" action href={office.href}>
          {office.text} <Badge pill>{office.badge}</Badge>
        </ListGroupItem>
      );
    }
    {
      /* <ListGroupItem tag="a" action href="#link2" color="info">CFB <Badge color="secondary">5</Badge></ListGroupItem>
    <ListGroupItem tag="a" action href="#link3">
      <ListGroupItemHeading>A Certain Casting Office</ListGroupItemHeading>
      <ListGroupItemText>
        Long list, of casting, names and, other info. Maybe a, list of, their projects, too.
      </ListGroupItemText>
    </ListGroupItem>
    <ListGroupItem tag="a" action href="#link4" color="success">Dorian &amp; Sibby Casting</ListGroupItem> */
    }
  }
}

export default OfficesItem;
