import { Components, registerComponent, Utils, withCurrentUser, withList } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React from 'react'
import PropTypes from 'prop-types'

const CommentsThread = (props, /* context*/) => {

  const {loading, terms: { postId }, results, totalCount, currentUser} = props;

  if (loading) {

    return <div className="posts-comments-thread"><Components.Loading/></div>

  } else {

    const resultsClone = _.map(results, _.clone); // we don't want to modify the objects we got from props
    const nestedComments = Utils.unflatten(resultsClone, {idProperty: '_id', parentIdProperty: 'parentCommentId'});

    return (
      <div className="posts-comments-thread">
        <h4 className="posts-comments-thread-title"><FormattedMessage id="comments.comments"/></h4>
        <Components.CommentsList currentUser={currentUser} comments={nestedComments} commentCount={totalCount}/>
        {!!currentUser ?
          <div className="posts-comments-thread-new">
            <h4><FormattedMessage id="comments.new"/></h4>
            <Components.CommentsNewForm
              postId={postId}
              type="comment"
            />
        </div> : null }
      </div>
    );
  }
};

CommentsThread.displayName = 'CommentsThread';

CommentsThread.propTypes = {
  currentUser: PropTypes.object
};

const options = {
  collectionName: 'Comments',
  queryName: 'commentsListQuery',
  fragmentName: 'CommentsList',
  limit: 0,
};

registerComponent({
  name: 'CommentsThread',
  component: CommentsThread,
  hocs: [
    withCurrentUser,
    [withList, options],
  ]
})
