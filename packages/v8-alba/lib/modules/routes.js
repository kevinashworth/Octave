import { addRoute } from 'meteor/vulcan:core'

addRoute({ path: '/', name: 'Home', componentName: 'Dashboard' });
addRoute({ path: '/dashboard', name: 'Dashboard', componentName: 'Dashboard' });
addRoute({ path: '/latest', name: 'Latest Updates', componentName: 'LatestUpdates' });
addRoute({ path: '/login', name: 'Login', componentName: 'Login' });
addRoute({ path: '/fragments', name: 'fragments', componentName: 'Fragments', layoutName: 'AdminLayout' });
addRoute({ path: '/contacts', name: 'Contacts', componentName: 'Contacts' });
addRoute({ path: '/contacts/datatable', name: 'Contacts', componentName: 'ContactsDataTable' });
addRoute({ path: '/contacts/:_id/edit', name: 'Edit Contact', componentName: 'ContactsEditForm' });
addRoute({ path: '/contacts/:_id/:slug?', name: 'contacts.single', componentName: 'ContactsSingle' });

addRoute([
  { name: 'Offices',        path: '/offices',             componentName: 'Offices' },
  { name: 'offices.table',  path: '/offices/datatable',   componentName: 'OfficesDataTable' },
  { name: 'offices.edit',   path: '/offices/:_id/edit',   componentName: 'OfficesEditForm' },
  { name: 'offices.single', path: '/offices/:_id/:slug?', componentName: 'OfficesSingle' }
])

addRoute({ path: '/projects', name: 'Projects', componentName: 'Projects' });
addRoute({ path: '/projects/datatable', name: 'Projects Table', componentName: 'ProjectsDataTable' });
addRoute({ path: '/projects/:_id/edit', name: 'projects.edit', componentName: 'ProjectsEditForm' });
addRoute({ path: '/projects/:_id/:slug?', name: 'projects.single', componentName: 'ProjectSingle' });
addRoute({ path: '/past-projects', name: 'Past Projects', componentName: 'PastProjects' });
addRoute({ path: '/past-projects/datatable', name: 'Past Projects Table', componentName: 'PastProjectsDataTable' });
addRoute({ path: '/past-projects/:_id/edit', name: 'pastprojects.edit', componentName: 'PastProjectsEditForm' });
addRoute({ path: '/past-projects/:_id/:slug?', name: 'pastprojects.single', componentName: 'PastProjectSingle' });
addRoute({ path: '/statistics/list', name: 'StatisticsList', componentName: 'StatisticsList' });
addRoute({ path: '/statistics/:_id/edit', name: 'StatisticsEditForm', componentName: 'StatisticsEditForm' });

addRoute([
  { name:'users.profile', path:'/users/:slug',      componentName: 'UsersProfile' },
  { name:'users.account', path:'/account',          componentName: 'UsersAccount' },
  { name:'users.edit',    path:'/users/:slug/edit', componentName: 'UsersAccount' }
])
