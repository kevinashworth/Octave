import Users from 'meteor/vulcan:users'

const membersActions = [
  'offices.new',
  'offices.edit.own',
  'offices.remove.own'
]
Users.groups.members.can(membersActions)

const adminActions = ['offices.edit.all', 'offices.remove.all']
Users.groups.admins.can(adminActions)
