/*

Emails

*/

import VulcanEmail from 'meteor/vulcan:email'

/*

Test

*/

VulcanEmail.addEmails({

  test: {
    template: 'test',
    path: '/email/test',
    data() {
      return {date: new Date()}
    },
    subject() {
      return 'This is a test'
    },
  }

})

/*

Users

*/

VulcanEmail.addEmails({

  newUser: {
    template: 'newUser',
    path: '/email/new-user/:_id?',
    subject() {
      return 'A new user has been created'
    },
    query: `
      query UsersSingleQuery($documentId: String){
        UsersSingle(documentId: $documentId){
          displayName
          pageUrl
        }
      }
    `
  },

  accountApproved: {
    template: 'accountApproved',
    path: '/email/account-approved/:_id?',
    subject() {
      return 'Your account has been approved.'
    },
    query: `
      query UsersSingleQuery($documentId: String){
        UsersSingle(documentId: $documentId){
          displayName
        }
        SiteData{
          title
          url
        }
      }
    `
  }

})

/*

Comments

*/

// const commentsQuery = `
//   query CommentsSingleQuery($documentId: String){
//     CommentsSingle(documentId: $documentId){
// const postsQuery = `
//   query singlePostQuery($documentId: String) {
//     PostsSingle(documentId: $documentId) {
//       title
//       url
//       pageUrl
//       linkUrl
//       htmlBody
//       post{
//         pageUrl
//         title
//       }
//       thumbnailUrl
//       user{
//         pageUrl
//         displayName
//       }
//     }
//   }
// `
//
// const dummyPost = {title: '[title]', user: {displayName: '[user]'}}
//
// VulcanEmail.addEmails({
//   newPost: {
//     template: 'newPost',
//     path: '/email/new-post/:_id?',
//     subject(data) {
//       const post = _.isEmpty(data) ? dummyPost : data.PostsSingle
//       return post.user.displayName+' has created a new post: '+post.title
//     },
//     query: postsQuery
//   },
//   newPendingPost: {
//     template: 'newPendingPost',
//     path: '/email/new-pending-post/:_id?',
//     subject(data) {
//       const post = _.isEmpty(data) ? dummyPost : data.PostsSingle
//       return post.user.displayName+' has a new post pending approval: '+post.title
//     },
//     query: postsQuery
//   },
//   postApproved: {
//     template: 'postApproved',
//     path: '/email/post-approved/:_id?',
//     subject(data) {
//       const post = _.isEmpty(data) ? dummyPost : data.PostsSingle
//       return 'Your post “'+post.title+'” has been approved'
//     },
//     query: postsQuery
//   }
// })

const commentsQuery = `
  query singleCommentQuery($input: SingleCommentInput!) {
    comment(input: $input) {
      result {
        pageUrl
        htmlBody
        user {
          displayName
        }
      }
    }
  }
`

const dummyComment = {
  post: {title: '[title]'},
  user: {displayName: '[user]'}
}

VulcanEmail.addEmails({

  newComment: {
    template: 'newComment',
    path: '/email/new-comment/:_id?',
    subject: 'A new comment!',
    query: commentsQuery
  },

  newReply: {
    template: 'newReply',
    path: '/email/new-reply/:_id?',
    subject(data) {
      const comment = _.isEmpty(data) ? dummyComment : data.comment.result
      return comment.user.displayName+' replied to your comment at ' + comment.pageUrl
    },
    query: commentsQuery
  },

  // newCommentSubscribed: {
  //   template: 'newComment',
  //   path: '/email/new-comment-subscribed/:_id?',
  //   subject(data) {
  //     const comment = _.isEmpty(data) ? dummyComment : data.CommentsSingle
  //     return comment.user.displayName+' left a new comment on "' + comment.post.title + '"'
  //   },
  //   query: commentsQuery
  // }

})

// subject({data}) {
//   const comment = _.isEmpty(data) ? dummyComment : data.comment.result
//   console.log('newComment comment:')
//   console.dir(comment)
//   return comment.user.displayName + ' left a new comment on your post'
// },
