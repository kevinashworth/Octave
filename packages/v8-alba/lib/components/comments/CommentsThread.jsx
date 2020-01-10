import { Components, registerComponent, Utils, withCurrentUser, withMulti } from 'meteor/vulcan:core'
import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, CardHeader } from 'reactstrap'
import _ from 'lodash'
import pluralize from 'pluralize'
import Comments from '../../modules/comments/collection.js'

const CommentsThread = (props, context) => {
  const { loading, terms: { collectionName, objectId }, results, totalCount, currentUser, callbackFromSingle } = props

  if (loading) {
    return <div className='posts-comments-thread'><Components.Loading /></div>
  } else {
    const commentsHeader = pluralize('Comment', totalCount, true)
    callbackFromSingle(commentsHeader)
    const resultsClone = _.map(results, _.clone) // we don't want to modify the objects we got from props
    const nestedComments = Utils.unflatten(resultsClone, { idProperty: '_id', parentIdProperty: 'parentCommentId' })

    return (
      <Card>
        <CardHeader className='class-accent-list'>{commentsHeader}</CardHeader>
        <CardBody>
          <Components.CommentsList currentUser={currentUser} comments={nestedComments} commentCount={totalCount} />
        </CardBody>
        <CardBody>
          {currentUser
            ? <Components.CommentsNewForm
                collectionName={collectionName}
                objectId={objectId}
                type='comment'
              />
            : null }
        </CardBody>
      </Card>
    )
  }
}

CommentsThread.displayName = 'CommentsThread'

CommentsThread.propTypes = {
  currentUser: PropTypes.object
}

const options = {
  collection: Comments,
  fragmentName: 'CommentsList',
  limit: 10
}

registerComponent({
  name: 'CommentsThread',
  component: CommentsThread,
  hocs: [
    withCurrentUser,
    [withMulti, options]
  ]
})
