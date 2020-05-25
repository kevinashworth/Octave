Package.describe({
  name: 'v8-alba',
  version: '1.14.1'
});

Package.onUse(function (api) {
  api.use([
    'vulcan:core',
    'vulcan:accounts',
    'vulcan:admin',
    'vulcan:backoffice',
    'vulcan:debug',
    'vulcan:email',
    'vulcan:forms',
    'vulcan:redux',
    'fourseven:scss',
    'percolate:migrations'
  ]);

  api.addFiles('lib/stylesheets/coreui-pro-2.1.6/scss/style.scss', 'client');

  api.addFiles([
    'lib/stylesheets/react-bootstrap-table-all.min.css',
    'lib/stylesheets/react-virtualized-styles.css',
    'lib/stylesheets/simple-line-icons.scss',
    'lib/stylesheets/spinner.scss'
  ], 'client');

  api.addFiles([
    'lib/stylesheets/coreui-pro-2.1.6/react-perfect-scrollbar-styles.css',
    'lib/stylesheets/custom/algolia.css',
    'lib/stylesheets/custom/btn.css',
    'lib/stylesheets/custom/custom-comments.scss',
    'lib/stylesheets/custom/custom-datatable.css',
    'lib/stylesheets/custom/custom-misc.css'
  ], 'client');

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
  ], ['server']);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');
});
