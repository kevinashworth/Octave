import { addRoute } from 'meteor/vulcan:core'

addRoute([
  { name: 'Home', path: '/', componentName: 'Dashboard' },
  { name: 'Dashboard', path: '/dashboard', componentName: 'Dashboard' },
  { name: 'Latest Updates', path: '/latest', componentName: 'LatestUpdates' }
])

addRoute([
  { name: 'Login', path: '/login', componentName: 'Login' },
  { name: 'NewRegistration', path: '/welcome/new', componentName: 'NewRegistration' }
])

addRoute({ path: '/fragments', name: 'fragments', componentName: 'Fragments', layoutName: 'LayoutAdmin' })

addRoute([
  { name: 'contacts.table', path: '/contacts', componentName: 'ContactsDataTable' },
  { name: 'contacts.mobile', path: '/m/contacts', componentName: 'ContactsNameOnly' },
  { name: 'contacts.edit', path: '/contacts/:_id/edit', componentName: 'ContactsEditForm' },
  { name: 'contacts.single', path: '/contacts/:_id/:slug?', componentName: 'ContactsSingle' }
])

addRoute([
  { name: 'offices.table', path: '/offices', componentName: 'OfficesDataTable' },
  { name: 'offices.mobile', path: '/m/offices', componentName: 'OfficesNameOnly' },
  { name: 'offices.edit', path: '/offices/:_id/edit', componentName: 'OfficesEditForm' },
  { name: 'offices.single', path: '/offices/:_id/:slug?', componentName: 'OfficesSingle' }
])

addRoute([
  { name: 'projects.table', path: '/projects', componentName: 'ProjectsDataTable' },
  { name: 'projects.mobile', path: '/m/projects', componentName: 'ProjectsNameOnly' },
  { name: 'projects.new', path: '/projects/new', componentName: 'ProjectsNewForm' },
  { name: 'projects.edit', path: '/projects/:_id/edit', componentName: 'ProjectsEditForm' },
  { name: 'projects.single', path: '/projects/:_id/:slug?', componentName: 'ProjectsSingle' }
])

addRoute([
  { name: 'pastprojects.table', path: '/past-projects', componentName: 'PastProjectsDataTable' },
  { name: 'pastprojects.edit', path: '/past-projects/:_id/edit', componentName: 'PastProjectsEditForm' },
  { name: 'pastprojects.single', path: '/past-projects/:_id/:slug?', componentName: 'PastProjectsSingle' }
])

addRoute({ path: '/statistics/list', name: 'StatisticsList', componentName: 'StatisticsList' })
addRoute({ path: '/statistics/edit', name: 'StatisticsEditForm', componentName: 'StatisticsEditForm' })

addRoute([
  { name: 'users.profile', path: '/users/:slug', componentName: 'UsersProfile' },
  { name: 'users.account', path: '/account', componentName: 'UsersAccount' },
  { name: 'users.edit', path: '/users/:slug/edit', componentName: 'UsersEdit' },
  { name: 'verifyEmail', path: '/verify-email/:token', componentName: 'AccountsVerifyEmail' }
])

addRoute([
  { name: 'admin.comments', path: '/admin/comments', componentName: 'AdminComments' },
  { name: 'admin.users', path: '/admin/users', componentName: 'AdminUsers' }
])
