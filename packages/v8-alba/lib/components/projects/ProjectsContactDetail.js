import { registerComponent } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import { Link } from 'react-router'
// import PropTypes from 'prop-types';
import { CardText } from 'reactstrap'

// import { Badge, ListGroupItem } from 'reactstrap';

class ProjectsContactDetail extends PureComponent {
  render () {
    const contact = this.props.contact
    return (
      <CardText className='mb-0'>
        { contact.contactTitle } <b><Link to={`/contacts/${contact.contactId}`}>{contact.contactName}</Link></b>
      </CardText>
    )
  }
}

// ProjectsContactDetail.propTypes = {
//   person: PropTypes.shape({
//     contactName: PropTypes.string.isRequired,
//     contactId: PropTypes.oneOfType([
//       PropTypes.string,
//       PropTypes.number
//     ]).isRequired,
//     contactTitle: PropTypes.string.isRequired,
//   })
// };

registerComponent('ProjectsContactDetail', ProjectsContactDetail)
