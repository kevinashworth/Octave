import SimpleSchema from 'simpl-schema'

export const addressSchema = new SimpleSchema({
  street1: {
    type: String,
    optional: true,
    viewableBy: ['members'],
    insertableBy: ['admins'],
    editableBy: ['admins']
  },
  street2: {
    type: String,
    optional: true,
    viewableBy: ['members'],
    insertableBy: ['admins'],
    editableBy: ['admins']
  },
  city: {
    type: String,
    optional: true,
    viewableBy: ['members'],
    insertableBy: ['admins'],
    editableBy: ['admins']
  },
  state: {
    type: String,
    optional: true,
    viewableBy: ['members'],
    insertableBy: ['admins'],
    editableBy: ['admins']
  },
  zip: {
    type: String,
    optional: true,
    viewableBy: ['members'],
    insertableBy: ['admins'],
    editableBy: ['admins']
  }
})
