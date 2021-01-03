Package.describe({
  name: 'octave',
  version: '1.16.29'
})

Package.onUse(function (api) {
  api.use([
    'vulcan:core',
    'vulcan:accounts',
    'vulcan:admin',
    'vulcan:backoffice',
    'vulcan:debug',
    'vulcan:email@1.16.0',
    'vulcan:forms',
    'vulcan:redux',
    'accounts-password@1.6.2',
    'email@2.0.0',
    'percolate:migrations'
  ])

  // import .scss in main.scss
  api.addFiles('lib/stylesheets/compiled/main.css', 'client')

  // import .css in these files
  api.addFiles([
    'lib/stylesheets/vendors/react-perfect-scrollbar.css',
    'lib/stylesheets/vendors/react-virtualized/styles.css'
  ], 'client')
  api.addFiles([
    'lib/stylesheets/custom/algolia.css',
    'lib/stylesheets/custom/btn.css',
    'lib/stylesheets/custom/datatable.css',
    'lib/stylesheets/custom/misc.css'
  ], 'client')

  api.addAssets([
    'lib/server/emails/templates/common/test.handlebars',
    'lib/server/emails/templates/common/wrapper.handlebars',
    'lib/server/emails/templates/comments/newComment.handlebars',
    'lib/server/emails/templates/comments/newReply.handlebars',
    // 'lib/server/emails/templates/posts/newPendingPost.handlebars',
    // 'lib/server/emails/templates/posts/newPost.handlebars',
    // 'lib/server/emails/templates/posts/postApproved.handlebars',
    'lib/server/emails/templates/users/accountApproved.handlebars',
    'lib/server/emails/templates/users/newUser.handlebars'
  ], 'server')

  api.mainModule('lib/server/main.js', 'server')
  api.mainModule('lib/client/main.js', 'client')
})
