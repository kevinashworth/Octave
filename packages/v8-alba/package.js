Package.describe({
  name: 'v8-alba',
  version: '1.0.0'
});

Package.onUse(function (api) {

  api.use([
    'vulcan:core',
    'vulcan:forms',
    'vulcan:accounts',
    'fourseven:scss',
    'percolate:migrations'
  ]);

  // api.addFiles('lib/stylesheets/index.styles.css', 'client');
  // api.addAssets('lib/stylesheets/index.styles.css.map', 'client');
  api.addFiles('lib/stylesheets/scss/style.scss', 'client');
  api.addFiles('lib/stylesheets/simple-line-icons.scss', 'client');
  api.addFiles('lib/stylesheets/react-bootstrap-table-all.min.css', 'client');
  api.addFiles('lib/stylesheets/spinner.scss', 'client');

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

});
