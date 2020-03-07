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

  // api.addFiles('lib/stylesheets/ContactsVirtualizedList.css', 'client');
  api.addFiles('lib/stylesheets/react-bootstrap-table-all.min.css', 'client');
  api.addFiles('lib/stylesheets/react-bootstrap-table2.min.css', 'client');
  api.addFiles('lib/stylesheets/react-bootstrap-table2-paginator.min.css', 'client');
  api.addFiles('lib/stylesheets/react-bootstrap-table2-toolkit.min.css', 'client');
  api.addFiles('lib/stylesheets/react-virtualized-styles.css', 'client');
  api.addFiles('lib/stylesheets/simple-line-icons.scss', 'client');
  api.addFiles('lib/stylesheets/spinner.scss', 'client');

  api.addFiles([
    'lib/stylesheets/alba-2.0.9/react-perfect-scrollbar-styles.css',
    'lib/stylesheets/alba-2.0.9/style.css',
    'lib/stylesheets/alba-2.0.9/custom-algolia.css',
    'lib/stylesheets/alba-2.0.9/custom-btn.css',
    'lib/stylesheets/alba-2.0.9/custom-comments.scss',
    'lib/stylesheets/alba-2.0.9/custom-containers.css',
    'lib/stylesheets/alba-2.0.9/custom-datatable.css',
    'lib/stylesheets/alba-2.0.9/custom-misc.css'
  ], ['client']);

  api.addAssets([
    'lib/server/emails/templates/common/test.handlebars',
    'lib/server/emails/templates/common/wrapper.handlebars',
    'lib/server/emails/templates/comments/newComment.handlebars',
    'lib/server/emails/templates/comments/newReply.handlebars',
    // 'lib/server/emails/templates/posts/newPendingPost.handlebars',
    // 'lib/server/emails/templates/posts/newPost.handlebars',
    // 'lib/server/emails/templates/posts/postApproved.handlebars',
    'lib/server/emails/templates/users/accountApproved.handlebars',
    'lib/server/emails/templates/users/newUser.handlebars',
  ], ['server'])

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');
});
