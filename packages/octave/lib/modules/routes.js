import { addRoute, dynamicLoader } from 'meteor/vulcan:core'

addRoute([
  { name: 'Home', path: '/', componentName: 'LatestUpdates' },
  { name: 'Latest Updates', path: '/latest', componentName: 'LatestUpdates' },
  {
    name: 'Trends',
    path: '/trends',
    component: dynamicLoader(() => import('../components/common/Trends/Trends.jsx'))
  }
])

addRoute([
  { name: 'Login', path: '/login', componentName: 'Login' },
  { name: 'NewRegistration', path: '/welcome/new', componentName: 'NewRegistration' }
])

addRoute([
  { name: 'contacts.new', path: '/contacts/new', componentName: 'ContactsNewForm' },
  { name: 'contacts.edit', path: '/contacts/:_id/edit', componentName: 'ContactsEditForm' },
  { name: 'contacts.single', path: '/contacts/:_id/:slug?', componentName: 'ContactsSingle' }
])

addRoute([
  { name: 'offices.new', path: '/offices/new', componentName: 'OfficesNewForm' },
  { name: 'offices.edit', path: '/offices/:_id/edit', componentName: 'OfficesEditForm' },
  { name: 'offices.single', path: '/offices/:_id/:slug?', componentName: 'OfficesSingle' }
])

addRoute([
  { name: 'pastprojects.edit', path: ['/past-projects/:_id/edit', '/pastprojects/:_id/edit'], componentName: 'PastProjectsEditForm' },
  { name: 'pastprojects.single', path: ['/past-projects/:_id/:slug?', '/pastprojects/:_id/:slug?'], componentName: 'PastProjectsSingle' }
])

addRoute([
  { name: 'projects.new', path: '/projects/new', componentName: 'ProjectsNewForm' },
  { name: 'projects.edit', path: '/projects/:_id/edit', componentName: 'ProjectsEditForm' },
  { name: 'projects.single', path: '/projects/:_id/:slug?', componentName: 'ProjectsSingle' }
])

addRoute([
  {
    name: 'statistics.edit',
    path: '/statistics/edit',
    component: dynamicLoader(() => import('../components/statistics/StatisticsEditForm'))
  },
  {
    name: 'statistics.list',
    path: '/statistics/list',
    component: dynamicLoader(() => import('../components/statistics/StatisticsList'))
  }
])

addRoute([
  { name: 'users.profile', path: '/users/:slug', componentName: 'UsersProfile' },
  { name: 'users.account', path: '/account', componentName: 'UsersAccount' },
  { name: 'users.edit', path: '/users/:slug/edit', componentName: 'UsersEdit' },
  { name: 'verifyEmail', path: ['/verify-email/:token', '/verifyemail/:token'], componentName: 'AccountsVerifyEmail' }
])

addRoute([
  {
    name: 'contacts.table',
    path: '/contacts',
    component: dynamicLoader(() => import('../components/contacts/ContactsDataTable'))
  },
  {
    name: 'contacts.mobile',
    path: '/m/contacts',
    component: dynamicLoader(() => import('../components/contacts/ContactsNameOnly'))
  },
  {
    name: 'offices.table',
    path: '/offices',
    component: dynamicLoader(() => import('../components/offices/OfficesDataTable'))
  },
  {
    name: 'offices.mobile',
    path: '/m/offices',
    component: dynamicLoader(() => import('../components/offices/OfficesNameOnly'))
  },
  {
    name: 'pastprojects.table',
    path: ['/past-projects', '/pastprojects'],
    component: dynamicLoader(() => import('../components/past-projects/PastProjectsDataTable'))
  },
  {
    name: 'projects.table',
    path: '/projects',
    component: dynamicLoader(() => import('../components/projects/ProjectsDataTable'))
  },
  {
    name: 'projects.mobile',
    path: '/m/projects',
    component: dynamicLoader(() => import('../components/projects/ProjectsNameOnly'))
  }
])

addRoute([
  {
    name: 'admin.comments',
    path: '/admin/comments',
    component: dynamicLoader(() => import('../components/admin/AdminComments'))
  },
  {
    name: 'admin.users',
    path: '/admin/users',
    component: dynamicLoader(() => import('../components/admin/AdminUsers'))
  }
])

addRoute({
  name: 'fragments',
  path: '/fragments',
  component: dynamicLoader(() => import('../components/common/Fragments'))
})

addRoute({
  name: 'ApolloTest',
  path: '/test',
  component: dynamicLoader(() => import('../components/projects/ApolloTest'))
})
