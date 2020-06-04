import { Components, registerComponent, getFragment, withCurrentUser, withMessages } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import React from 'react'
import PropTypes from 'prop-types'
import { Comments } from '../../modules/comments/index.js'
import { FormattedMessage } from 'meteor/vulcan:i18n'

const CommentsNewForm = ({ currentUser, collectionName, objectId, parentComment, type, successCallback, cancelCallback }) => {
  let prefilledProps = {
    collectionName: collectionName,
    objectId: objectId
  }

  if (parentComment) {
    prefilledProps = Object.assign(prefilledProps, {
      parentCommentId: parentComment._id,
      // if parent comment has a topLevelCommentId use it; if it doesn't then it *is* the top level comment
      topLevelCommentId: parentComment.topLevelCommentId || parentComment._id
    })
  }

  return Users.canCreate({ collection: Comments, user: currentUser })
    ? <div className='comments-new-form'>
        <Components.SmartForm
          collection={Comments}
          mutationFragment={getFragment('CommentsList')}
          successCallback={successCallback}
          cancelCallback={type === 'reply' ? cancelCallback : null}
          prefilledProps={prefilledProps}
          layout='inputOnly'
        />
      </div>
    : <FormattedMessage id='users.cannot_comment' />
}

CommentsNewForm.propTypes = {
  objectId: PropTypes.string.isRequired,
  type: PropTypes.string, // "comment" or "reply"
  parentComment: PropTypes.object, // if reply, the comment being replied to
  parentCommentId: PropTypes.string, // if reply
  topLevelCommentId: PropTypes.string, // if reply
  successCallback: PropTypes.func, // a callback to execute when the submission has been successful
  cancelCallback: PropTypes.func,
  router: PropTypes.object,
  flash: PropTypes.func
}

registerComponent({
  name: 'CommentsNewForm',
  component: CommentsNewForm,
  hocs: [withCurrentUser, withMessages]
})
