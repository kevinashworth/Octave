import SimpleSchema from 'simpl-schema'

export const addressSchema = {
  street1: {
    type: String,
    optional: true,
    canRead: ['members'],
    canCreate: ['admins'],
    canUpdate: ['admins']
  },
  street2: {
    type: String,
    optional: true,
    canRead: ['members'],
    canCreate: ['admins'],
    canUpdate: ['admins']
  },
  city: {
    type: String,
    optional: true,
    canRead: ['members'],
    canCreate: ['admins'],
    canUpdate: ['admins']
  },
  state: {
    type: String,
    optional: true,
    canRead: ['members'],
    canCreate: ['admins'],
    canUpdate: ['admins']
  },
  zip: {
    type: String,
    optional: true,
    canRead: ['members'],
    canCreate: ['admins'],
    canUpdate: ['admins']
  },
  location: {
    type: String,
    optional: true,
    hidden: true,
    canRead: ['members'],
    canCreate: ['admins'],
    canUpdate: ['admins']
  }
}

export const addressSubSchema = new SimpleSchema(addressSchema)

export const linkSubSchema = new SimpleSchema({
  platformName: {
    type: String,
    canRead: ['members'],
    canCreate: ['admins'],
    canUpdate: ['admins']
  },
  profileName: {
    type: String,
    canRead: ['members'],
    canCreate: ['admins'],
    canUpdate: ['admins']
  },
  profileLink: {
    type: String,
    canRead: ['members'],
    canCreate: ['admins'],
    canUpdate: ['admins']
  }
})
