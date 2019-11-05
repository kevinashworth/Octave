import { Components, registerComponent, withMessages } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import { Comments } from '../../modules/comments/index.js'
import moment from 'moment'

class CommentsItem extends PureComponent {
  constructor () {
    super();
    [
      'showReply',
      'replyCancelCallback',
      'replySuccessCallback',
      'showEdit',
      'editCancelCallback',
      'editSuccessCallback',
      'removeSuccessCallback'
    ].forEach(methodName => { this[methodName] = this[methodName].bind(this) })
    this.state = {
      showReply: false,
      showEdit: false
    }
  }

  showReply (event) {
    event.preventDefault()
    this.setState({ showReply: true })
  }

  replyCancelCallback (event) {
    this.setState({ showReply: false })
  }

  replySuccessCallback () {
    this.setState({ showReply: false })
  }

  showEdit (event) {
    event.preventDefault()
    this.setState({ showEdit: true })
  }

  editCancelCallback (event) {
    this.setState({ showEdit: false })
  }

  editSuccessCallback () {
    this.setState({ showEdit: false })
  }

  removeSuccessCallback ({ documentId }) {
    this.props.flash({ id: 'comments.delete_success', type: 'success' })
  }

  renderComment () {
    const htmlBody = { __html: this.props.comment.htmlBody }
    const showReplyButton = !this.props.comment.isDeleted && !!this.props.currentUser
    return (
      <div className='comments-item-text'>
        <div dangerouslySetInnerHTML={htmlBody} />
        {showReplyButton
          ? <small className='text-muted'>
              <a onClick={this.showReply}><FormattedMessage id='comments.reply' /></a>
            </small> : null }
      </div>
    )
  }

  renderReply () {
    return (
      <div className='comments-item-reply'>
        <Components.CommentsNewForm
          objectId={this.props.comment.objectId}
          collectionName={this.props.comment.collectionName}
          parentComment={this.props.comment}
          successCallback={this.replySuccessCallback}
          cancelCallback={this.replyCancelCallback}
          type='reply'
        />
      </div>
    )
  }

  renderEdit () {
    return (
      <Components.CommentsEditForm
        comment={this.props.comment}
        successCallback={this.editSuccessCallback}
        cancelCallback={this.editCancelCallback}
        removeSuccessCallback={this.removeSuccessCallback}
      />
    )
  }

  render () {
    const comment = this.props.comment
    return (
      <div className='comments-item' id={comment._id}>
        <div className='comments-item-body'>
          <div className='comments-item-meta'>
            <Components.Avatar size='xsmall' user={comment.user} />
            <Components.UsersName user={comment.user} />
            <div className='comments-item-date'>{moment(new Date(comment.postedAt)).fromNow()}</div>
            {Comments.options.mutations.edit.check(this.props.currentUser, this.props.comment) &&
              <div className='flexbox-float-right'>
                <small className='text-muted'>
                  <a onClick={this.showEdit}><FormattedMessage id='comments.edit' /></a>
                </small>
              </div>
            }
          </div>
          {this.state.showEdit ? this.renderEdit() : this.renderComment()}
        </div>
        {this.state.showReply ? this.renderReply() : null}
      </div>
    )
  }
}

CommentsItem.propTypes = {
  comment: PropTypes.object.isRequired, // the current comment
  currentUser: PropTypes.object,
  flash: PropTypes.func
}

registerComponent({ name: 'CommentsItem', component: CommentsItem, hocs: [withMessages] })