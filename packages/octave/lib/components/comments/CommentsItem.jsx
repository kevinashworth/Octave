import { Components, registerComponent, withMessages } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import MyMarkdown from '../common/MyMarkdown'
import { Comments } from '../../modules/comments/index.js'

class CommentsItem extends Component {
  constructor () {
    super()
    this.state = {
      showReply: false,
      showEdit: false
    }
  }

  editCancelCallback = (event) => {
    this.setState({ showEdit: false })
  }

  editSuccessCallback = () => {
    this.setState({ showEdit: false })
  }

  handleClickShowEdit = (event) => {
    event.preventDefault()
    this.setState({ showEdit: true })
  }

  handleClickShowReply = (event) => {
    event.preventDefault()
    this.setState({ showReply: true })
  }

  removeSuccessCallback = ({ documentId }) => {
    this.props.flash({ id: 'comments.delete_success', type: 'success' })
  }

  replyCancelCallback = (event) => {
    this.setState({ showReply: false })
  }

  replySuccessCallback = () => {
    this.setState({ showReply: false })
  }

  renderComment = () => {
    const showReplyButton = !this.props.comment.isDeleted && !!this.props.currentUser
    return (
      <div className='comments-item-text'>
        <MyMarkdown markdown={this.props.comment.body} />
        {showReplyButton &&
          <small className='text-muted'>
            <a onClick={this.handleClickShowReply}><FormattedMessage id='comments.reply' /></a>
          </small>}
      </div>
    )
  }

  renderReply = () => {
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

  renderEdit = () => {
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
    const { comment, currentUser } = this.props
    return (
      <div className='comments-item' id={comment._id}>
        <div className='comments-item-body'>
          <div className='comments-item-meta'>
            <Components.Avatar size='xsmall' user={comment.user} />
            <Components.UsersName user={comment.user} />
            <div className='comments-item-date'>{moment(comment.postedAt).fromNow()}</div>
            {Users.canUpdate({ collection: Comments, user: currentUser, document: comment }) &&
              <div className='flexbox-float-right'>
                <small className='text-muted'>
                  <a onClick={this.handleClickShowEdit}><FormattedMessage id='comments.edit' /></a>
                </small>
              </div>}
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
