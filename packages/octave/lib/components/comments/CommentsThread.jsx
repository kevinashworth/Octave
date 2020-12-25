import { Components, registerComponent, Utils, useCurrentUser, useMulti2 } from 'meteor/vulcan:core'
import React, { useEffect } from 'react'
import Card from 'react-bootstrap/Card'
import clone from 'lodash/clone'
import map from 'lodash/map'
import pluralize from 'pluralize'
import Comments from '../../modules/comments/collection.js'

const CommentsThread = (props) => {
  const { callbackFromSingle, collectionName, objectId } = props

  const { currentUser } = useCurrentUser()
  const { loading, results, totalCount } = useMulti2({
    collection: Comments,
    fragmentName: 'CommentsList',
    input: { filter: { objectId: { _eq: props.objectId } } },
    limit: 0
  })

  const getCommentsHeader = (totalCount) => {
    const prefixWithNumber = totalCount > 0
    const commentsHeader = pluralize('Comment', totalCount, prefixWithNumber)
    return commentsHeader
  }

  const commentsHeader = getCommentsHeader(totalCount)

  useEffect(() => {
    callbackFromSingle(commentsHeader)
  })

  if (loading) {
    return <Components.Loading />
  }

  const resultsClone = map(results, clone) // we don't want to modify the objects we got from props
  const nestedComments = Utils.unflatten(resultsClone, { idProperty: '_id', parentIdProperty: 'parentCommentId' })

  return (
    <Card>
      <Card.Header className='class-accent-list'>{commentsHeader}</Card.Header>
      <Card.Body>
        <Components.CommentsList currentUser={currentUser} comments={nestedComments} commentCount={totalCount} />
      </Card.Body>
      <Card.Body>
        {currentUser &&
          <Components.CommentsNewForm
            collectionName={collectionName}
            objectId={objectId}
            type='comment'
          />}
      </Card.Body>
    </Card>
  )
}

registerComponent({
  name: 'CommentsThread',
  component: CommentsThread
})

export default CommentsThread
