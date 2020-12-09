import { Components, registerComponent } from 'meteor/vulcan:core'
import React from 'react'
import { FormattedMessage } from 'meteor/vulcan:i18n'

const CommentsList = ({ comments, commentCount, currentUser }) => {
  if (commentCount > 0) {
    return (
      <div className='comments-list'>
        {comments.map(comment => <Components.CommentsNode currentUser={currentUser} comment={comment} key={comment._id} />)}
      </div>
    )
  } else {
    return (
      <div className='comments-list'>
        <FormattedMessage id='comments.no_comments' />
      </div>
    )
  }
}

registerComponent({
  name: 'CommentsList',
  component: CommentsList
})
