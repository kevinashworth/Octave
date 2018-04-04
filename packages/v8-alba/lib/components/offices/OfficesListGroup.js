import React, {Component} from 'react';
import { Card, CardBody, CardHeader, ListGroup } from 'reactstrap';
import OfficesItem from './OfficesItem.js';
import offices from './_offices.js';

class OfficesListGroup extends Component {
  render() {
    return (
      <div className="animated">
        <Card>
          <CardHeader>
            <i className="icon-briefcase"></i>Offices as ListGroup
          </CardHeader>
          <CardBody>
            <ListGroup>
              {/* <ListGroupItem tag="a" action href="#link1">Joe Blow Casting <Badge pill>14</Badge></ListGroupItem>
              <ListGroupItem tag="a" action href="#link2" color="info">CFB <Badge color="secondary">5</Badge></ListGroupItem>
              <ListGroupItem tag="a" action href="#link3">
                <ListGroupItemHeading>A Certain Casting Office</ListGroupItemHeading>
                <ListGroupItemText>
                  Long list, of casting, names and, other info. Maybe a, list of, their projects, too.
                </ListGroupItemText>
              </ListGroupItem>
              <ListGroupItem tag="a" action href="#link4" color="success">Dorian &amp; Sibby Casting</ListGroupItem> */}

              {offices.items.map(office => <OfficesItem key={office._id} office={office} />)}
            </ListGroup>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default OfficesListGroup;
