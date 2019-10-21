import { Components, registerComponent, Utils, withCurrentUser, withMulti } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, CardFooter, CardHeader, CardLink, CardText, CardTitle } from 'reactstrap'
import _ from 'lodash'
import Comments from '../../modules/comments/collection.js'

const CommentsThread = (props) => {
  const { loading, terms: { collectionName, objectId }, results, totalCount, currentUser } = props

  if (loading) {
    return <div className='posts-comments-thread'><Components.Loading /></div>
  } else {
    const resultsClone = _.map(results, _.clone) // we don't want to modify the objects we got from props
    const nestedComments = Utils.unflatten(resultsClone, { idProperty: '_id', parentIdProperty: 'parentCommentId' })

    return (
      <Card>
        <CardHeader className='class-accent-list'><FormattedMessage id='comments.comments' /></CardHeader>
        <CardBody>
            <CardText>
              <Components.CommentsList currentUser={currentUser} comments={nestedComments} commentCount={totalCount} />
              {currentUser
                ? <CardBody>
                    <CardTitle><FormattedMessage id='comments.new' /></CardTitle>
                    <CardText>
                      <Components.CommentsNewForm
                        collectionName={collectionName}
                        objectId={objectId}
                        type='comment'
                      />
                    </CardText>
                  </CardBody>
                : null }
          </CardText>
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
