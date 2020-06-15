import { Components, registerComponent, Utils, withCurrentUser, withMulti } from 'meteor/vulcan:core'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Card from 'react-bootstrap/Card'
import _ from 'lodash'
import pluralize from 'pluralize'
import Comments from '../../modules/comments/collection.js'

class CommentsThread extends Component {
  constructor (props) {
    super(props)
    this.state = {
      commentsHeader: 'Comments'
    }
  }

  // we need both these (nearly identical) functions
  componentDidMount () {
    const { totalCount, callbackFromSingle } = this.props
    if (totalCount) {
      const commentsHeader = pluralize('Comment', totalCount, true)
      this.setState({ commentsHeader })
      callbackFromSingle(commentsHeader)
    }
  }

  componentDidUpdate (prevProps) {
    const { totalCount, callbackFromSingle } = this.props
    if (totalCount && prevProps.totalCount !== totalCount) {
      const commentsHeader = pluralize('Comment', totalCount, totalCount > 0)
      this.setState({ commentsHeader })
      callbackFromSingle(commentsHeader)
    }
  }

  render () {
    const { loading, terms: { collectionName, objectId }, results, totalCount, currentUser } = this.props
    if (loading) {
      return <Components.Loading />
    }
    const resultsClone = _.map(results, _.clone) // we don't want to modify the objects we got from props
    const nestedComments = Utils.unflatten(resultsClone, { idProperty: '_id', parentIdProperty: 'parentCommentId' })

    return (
      <Card>
        <Card.Header className='class-accent-list'>{this.state.commentsHeader}</Card.Header>
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

export default CommentsThread
