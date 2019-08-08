Package.describe({
  name: 'v8-alba',
  version: '1.1.0'
});

Package.onUse(function (api) {
  api.use([
    'vulcan:core',
    'vulcan:accounts',
    'vulcan:admin',
    'vulcan:forms',
    'vulcan:redux',
    'fourseven:scss',
    'percolate:migrations'
  ]);

  api.addFiles('lib/stylesheets/scss/style.scss', 'client');
  api.addFiles('lib/stylesheets/simple-line-icons.scss', 'client');
  api.addFiles('lib/stylesheets/react-bootstrap-table-all.min.css', 'client');
  api.addFiles('lib/stylesheets/spinner.scss', 'client');
  api.addFiles('lib/stylesheets/react-select.min.css', 'client');
  api.addFiles('lib/stylesheets/react-virtualized-select-styles.css', 'client');

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');
});
