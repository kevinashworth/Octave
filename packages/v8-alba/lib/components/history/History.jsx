import { Components,  registerComponent, withCurrentUser, withSingle } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, CardFooter, CardHeader, CardSubtitle, CardText } from 'reactstrap'
import Histories from '../../modules/history/collection.js'

const Diff = ({ change }) => {
  return (
    <>
    <CardSubtitle>{change.date}</CardSubtitle>
    <CardText>{JSON.stringify(change.diff)}</CardText>
    </>
  )
}

const History = ({ document, loading }) => {
  if (loading) {
    return <Components.Loading />
  }
  const changes = document.changes
  return (
    <Card>
      <CardHeader>
        <i className='icon-refresh' />History
      </CardHeader>
      <CardBody>
        {changes.map((change, index) => <Diff key={index} change={change} />)}
      </CardBody>
      <CardFooter>
        This is the footer
      </CardFooter>
    </Card>
  )
}

const options = {
  collection: Histories
}

History.propTypes = {
  documentId: PropTypes.string.isRequired,
}

registerComponent({
  name: 'History',
  component: History,
  hocs: [withCurrentUser, [withSingle, options]]
})
