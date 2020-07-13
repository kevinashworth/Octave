import { Components, registerComponent, Utils, withCurrentUser, withMulti2 } from 'meteor/vulcan:core'
import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import clone from 'lodash/clone'
import map from 'lodash/map'
import pluralize from 'pluralize'
import mapProps from 'recompose/mapProps'
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
    const { collectionName, currentUser, loading, objectId, results, totalCount } = this.props
    if (loading) {
      return <Components.Loading />
    }

    const resultsClone = map(results, clone) // we don't want to modify the objects we got from props
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

const options = {
  collection: Comments,
  fragmentName: 'CommentsList',
  limit: 0
}

const mapPropsFunction = (props) => {
  return {
    ...props,
    input: { filter: { objectId: { _eq: props.objectId } } }
  }
}

registerComponent({
  name: 'CommentsThread',
  component: CommentsThread,
  hocs: [
    withCurrentUser,
    mapProps(mapPropsFunction), [withMulti2, options]
  ]
})

export default CommentsThread
