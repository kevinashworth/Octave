import Users from 'meteor/vulcan:users'

const membersActions = [
  'projects.new',
  'projects.edit.own',
  'projects.remove.own'
]
Users.groups.members.can(membersActions)

const adminActions = ['projects.edit.all', 'projects.remove.all']
Users.groups.admins.can(adminActions)
