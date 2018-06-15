import { Components, Utils } from 'meteor/vulcan:core';
import SimpleSchema from 'simpl-schema';
import { addressSchema } from '../shared_schemas.js';

export const contactSchema = new SimpleSchema({
  contactId: {
    type: String,
    control: "SelectContactIdNameTitle",
    optional: true,
    viewableBy: ["members"],
    insertableBy: ["admins"],
    editableBy: ["admins"],
    options: props => props.data.ContactsList.map(contact => ({
        value: contact._id,
        label: contact.fullName,
      })),
  },
  contactName: {
    type: String,
    optional: true,
    hidden: true,
    viewableBy: ["members"],
    insertableBy: ["admins"],
    editableBy: ["admins"],
  },
  contactTitle: {
    type: String,
    optional: true,
    hidden: true,
    viewableBy: ["members"],
    insertableBy: ["admins"],
    editableBy: ["admins"],
  },
});

const schema = {
  // default properties

  _id: {
    type: String,
    optional: true,
    viewableBy: ["guests"]
  },
  createdAt: {
    type: Date,
    optional: true,
    viewableBy: ["members"],
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

  projectTitle: {
    label: "Title",
    type: String,
    optional: true,
    viewableBy: ["guests"],
    insertableBy: ["admins"],
    editableBy: ["admins"]
  },
  projectType: {
    label: "Type",
    type: String,
    optional: true,
    viewableBy: ["guests"],
    insertableBy: ["admins"],
    editableBy: ["admins"]
  },
  union: {
    label: "Union",
    type: String,
    optional: true,
    viewableBy: ["guests"],
    insertableBy: ["admins"],
    editableBy: ["admins"]
  },
  network: {
    label: "Network",
    type: String,
    optional: true,
    viewableBy: ["guests"],
    insertableBy: ["admins"],
    editableBy: ["admins"]
  },
  status: {
    label: "Status",
    type: String,
    optional: true,
    viewableBy: ["guests"],
    insertableBy: ["admins"],
    editableBy: ["admins"]
  },
  logline: {
    label: "Logline",
    type: String,
    optional: true,
    viewableBy: ["guests"],
    insertableBy: ["admins"],
    editableBy: ["admins"]
  },
  notes: {
    label: "Notes",
    type: String,
    optional: true,
    control: "textarea", // use a textarea form component
    viewableBy: ["members"],
    insertableBy: ["admins"],
    editableBy: ["admins"]
  },
  season: {
    label: "Season",
    type: String,
    optional: true,
    viewableBy: ["guests"],
    insertableBy: ["admins"],
    editableBy: ["admins"]
  },
  order: {
    label: "Order",
    type: String,
    optional: true,
    viewableBy: ["guests"],
    insertableBy: ["admins"],
    editableBy: ["admins"]
  },
  castingCompany: {
    label: "Casting Company",
    type: String,
    optional: true,
    viewableBy: ["guests"],
    insertableBy: ["admins"],
    editableBy: ["admins"]
  },
  contacts: {
    label: "contacts",
    type: Array,
    optional: true,
    viewableBy: ["members"],
    insertableBy: ["admins"],
    editableBy: ["admins"],
    query: `
      ContactsList{
        _id
        fullName
      }
    `,
  },
  'contacts.$': {
    type: contactSchema,
  },
  addresses: {
    type: Array,
    optional: true,
    viewableBy: ["members"],
    insertableBy: ["admins"],
    editableBy: ["admins"],
  },
  'addresses.$': {
    type: addressSchema
  },
  slug: {
    type: String,
    optional: true,
    viewableBy: ["guests"],
    onInsert: (project) => {
      return Utils.slugify(project.projectTitle);
    },
    onEdit: (modifier, project) => {
      if (modifier.$set.projectTitle) {
        return Utils.slugify(modifier.$set.projectTitle);
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
