import { Utils } from 'meteor/vulcan:core';

const schema = {
  // default properties

  _id: {
    type: String,
    optional: true,
    viewableBy: ["guests"],
    insertableBy: ["admins"],
    editableBy: ["admins"]
  },
  createdAt: {
    type: Date,
    optional: true,
    viewableBy: ["members"],
    insertableBy: ["admins"],
    editableBy: ["admins"],
    onInsert: () => {
      return new Date();
    }
  },
  userId: {
    type: String,
    optional: true,
    viewableBy: ["members"],
    insertableBy: ["admins"],
    editableBy: ["admins"]
  },

  // custom properties

  displayName: {
    label: "Name",
    type: String,
    optional: true,
    viewableBy: ["guests"],
    insertableBy: ["admins"],
    editableBy: ["admins"]
  },
  body: {
    label: "Notes",
    type: String,
    optional: true,
    control: "textarea", // use a textarea form component
    viewableBy: ["members"],
    insertableBy: ["admins"],
    editableBy: ["admins"]
  },
  street1: {
    label: "Address",
    type: String,
    optional: true,
    viewableBy: ["members"],
    insertableBy: ["admins"],
    editableBy: ["admins"]
  },
  street2: {
    label: "(cont)",
    type: String,
    optional: true,
    viewableBy: ["members"],
    insertableBy: ["admins"],
    editableBy: ["admins"]
  },
  city: {
    label: "City",
    type: String,
    optional: true,
    viewableBy: ["members"],
    insertableBy: ["admins"],
    editableBy: ["admins"]
  },
  state: {
    label: "State",
    type: String,
    optional: true,
    viewableBy: ["members"],
    insertableBy: ["admins"],
    editableBy: ["admins"]
  },
  zip: {
    label: "Zip",
    type: String,
    optional: true,
    viewableBy: ["members"],
    insertableBy: ["admins"],
    editableBy: ["admins"]
  },
  slug: {
    type: String,
    optional: true,
    viewableBy: ["members"],
    insertableBy: ["admins"],
    editableBy: ["admins"],
    onInsert: (contact) => {
      return Utils.slugify(contact.displayName);
    },
    onEdit: (modifier, contact) => {
      if (modifier.$set.displayName) {
        return Utils.slugify(modifier.$set.displayName);
      }
    }
  },
  updatedAt: {
    type: Date,
    optional: true,
    viewableBy: ["guests"],
    onEdit: () => {
      return new Date();
    }
  },
};

export default schema;
