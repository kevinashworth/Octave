import { Components,  registerComponent, withCurrentUser, withSingle } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, CardFooter, CardHeader } from 'reactstrap'

const History = ({ currentUser, document, loading }) => {
  if (loading) {
    return <Components.Loading />
  }
  return (
    <Card>
      <CardHeader>
        <i className='icon-briefcase' />History
      </CardHeader>
      <CardBody>
        {document}
      </CardBody>
      <CardFooter>
        This is the footer
      </CardFooter>
    </Card>
  )
}

const options = {
  collection: History
}

History.propTypes = {
  documentId: PropTypes.string.isRequired,
}

registerComponent({
  name: 'History',
  component: History,
  hocs: [withCurrentUser, [withSingle, options]]
})
