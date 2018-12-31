import Users from 'meteor/vulcan:users'

const membersActions = [
  'past-projects.new',
  'past-projects.edit.own',
  'past-projects.remove.own'
]
Users.groups.members.can(membersActions)

const adminActions = ['past-projects.edit.all', 'past-projects.remove.all']
Users.groups.admins.can(adminActions)
