import Users from 'meteor/vulcan:users'

const guestsActions = [
  'comments.view'
]
Users.groups.guests.can(guestsActions)

const membersActions = [
  'comments.new',
  'comments.edit.own',
  'comments.remove.own'
]
Users.groups.members.can(membersActions)

const adminActions = [
  'comments.edit.all',
  'comments.remove.all'
]
Users.groups.admins.can(adminActions)
