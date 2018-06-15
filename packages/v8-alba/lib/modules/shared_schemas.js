import SimpleSchema from 'simpl-schema';

export const addressSchema = new SimpleSchema({
  street1: {
    type: String,
    optional: true
  },
  street2: {
    type: String,
    optional: true
  },
  city: {
    type: String,
    optional: true
  },
  state: {
    type: String,
    optional: true
  },
  zip: {
    type: String,
    optional: true
  },
});
