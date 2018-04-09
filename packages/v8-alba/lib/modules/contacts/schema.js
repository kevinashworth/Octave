import { Utils } from 'meteor/vulcan:core';
import Contacts from './collection.js';

const schema = {
  // default properties

  _id: {
    type: String,
    optional: true,
    viewableBy: ["members"]
  },
  createdAt: {
    type: Date,
    optional: true,
    viewableBy: ["guests"],
    onInsert: () => {
      return new Date();
    }
  },
  userId: {
    type: String,
    optional: true,
    viewableBy: ["members"]
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
    viewableBy: ["guests"],
    insertableBy: ["admins"],
    editableBy: ["admins"]
  },
  street1: {
    label: "Address",
    type: String,
    optional: true,
    viewableBy: ["guests"],
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
    viewableBy: ['guests'],
    onInsert: contact => {
      const slug = Utils.slugify(contact.displayName);
      let suffix = "";
      let index = 0;
      while (!!Contacts.findOne({slug: slug+suffix})) {
        index++;
        suffix = "-"+index;
      }
      return slug+suffix;
    },
    onEdit: (modifier, contact) => {
      if (modifier.$set.displayName) {
        const slug = Utils.slugify(contact.displayName);
        let suffix = "";
        let index = 0;
        while (!!Contacts.findOne({slug: slug+suffix})) {
          index++;
          suffix = "-"+index;
        }
        return slug+suffix;
      }
    }
  },
};

export default schema;
