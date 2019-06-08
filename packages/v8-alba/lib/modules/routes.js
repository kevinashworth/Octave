import { addRoute } from 'meteor/vulcan:core'

addRoute([
  { path: '/', name: 'Home', componentName: 'Dashboard' }, // <Redirect from='/' to='/dashboard'/>
  { path: '/dashboard', name: 'Dashboard', componentName: 'Dashboard' },
  { path: '/latest', name: 'Latest Updates', componentName: 'LatestUpdates' },
  { path: '/login', name: 'Login', componentName: 'Login' },
  // {path: '/modals',              name: 'Modals Test',    componentName: 'Modals'},
  // {path: '/projects',                   name: 'Projects (T)',    componentName: 'ProjectsTable'},
  { name: 'fragments', path: '/fragments', componentName: 'Fragments', layoutName: 'AdminLayout' }
])

// addRoute([
//   {path: '/cdt',                    name: 'CDT',              componentName: 'CDT'},
// ]);

addRoute([
  { path: '/contacts', name: 'Contacts', componentName: 'Contacts' }, 'Home'
])

addRoute([
  // {path: '/contacts',           name: 'Contacts',           componentName: 'ContactsTable'} Contacts.jsx redirects to ContactsTable
  // {path: '/contacts/table',        name: 'Contacts Table',     componentName: 'ContactsTable'},
  { path: '/contacts/datatable', name: 'Contacts', componentName: 'ContactsDataTable' },
  { path: '/contacts/:_id/edit', name: 'Edit Contact', componentName: 'ContactsEditForm' },
  { path: '/contacts/:_id(/:slug)', name: 'contacts.single', componentName: 'ContactsSingle' }
], 'Contacts')

addRoute([
  { path: '/offices', name: 'Offices', componentName: 'Offices' }, 'Home'
])

addRoute([
  { path: '/offices/list', name: 'Offices List', componentName: 'OfficesListGroup' },
  { path: '/offices/:_id/edit', name: 'offices.edit', componentName: 'OfficesEditForm' },
  { path: '/offices/:_id(/:slug)', name: 'offices.single', componentName: 'OfficesSingle' }
], 'Offices')

addRoute([
  { path: '/projects', name: 'Projects', componentName: 'Projects' }, 'Home'
])

addRoute([
  { path: '/projects/datatable', name: 'Projects Table', componentName: 'ProjectsDataTable' },
  { path: '/projects/:_id/edit', name: 'projects.edit', componentName: 'ProjectsEditForm' },
  { path: '/projects/:_id(/:slug)', name: 'projects.single', componentName: 'ProjectSingle' }
], 'Projects')

addRoute([
  { path: '/past-projects', name: 'Past Projects', componentName: 'PastProjects' }, 'Home'
])

addRoute([
  { path: '/past-projects/datatable', name: 'Past Projects Table', componentName: 'PastProjectsDataTable' },
  { path: '/past-projects/:_id/edit', name: 'pastprojects.edit', componentName: 'PastProjectsEditForm' },
  { path: '/past-projects/:_id(/:slug)', name: 'pastprojects.single', componentName: 'PastProjectSingle' }
], 'Past Projects')

addRoute([
  { path: '/statistics/list', name: 'StatisticsList', componentName: 'StatisticsList' },
  { path: '/statistics/:_id/edit', name: 'StatisticsEditForm', componentName: 'StatisticsEditForm' }
])