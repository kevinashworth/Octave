import { registerComponent } from 'meteor/vulcan:core'
import React from 'react'
import { Link } from 'react-router-dom'
// import PropTypes from 'prop-types'
import Card from 'react-bootstrap/Card'

const OfficesPersonDetail = (props) => {
  const person = props.person
  return (
    <Card.Text>
      {person.personnelTitle} <b>{person.name}</b> ({person.contactId})
      <Link to={`/contacts/${person._id}`}>
        {person.name}
      </Link>
    </Card.Text>
  )
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
