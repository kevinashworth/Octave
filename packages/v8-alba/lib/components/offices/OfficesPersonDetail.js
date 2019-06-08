import { registerComponent } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
// import PropTypes from 'prop-types'
import { CardText } from 'reactstrap'

class OfficesPersonDetail extends PureComponent {
  render () {
    const person = this.props.person
    return (
      <CardText>
        { person.personnelTitle} <b>{ person.name }</b> ({person.contactId})
        <Link to={`/contacts/${person._id}`}>
          {person.name}
        </Link>
      </CardText>
    )
  }
}

// OfficesPersonDetail.propTypes = {
//   person: PropTypes.shape({
//     name: PropTypes.string.isRequired,
//     contactId: PropTypes.string.isRequired,
//     personnelTitle: PropTypes.string
//   })
// }
//
registerComponent('OfficesPersonDetail', OfficesPersonDetail)
