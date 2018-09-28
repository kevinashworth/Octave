import Users from 'meteor/vulcan:users'

const membersActions = [
  'contacts.new',
  'contacts.edit.own']
Users.groups.members.can(membersActions)

const adminActions = ['contacts.edit.all', 'contacts.remove.all']
Users.groups.admins.can(adminActions)
