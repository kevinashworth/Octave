import { Utils } from 'meteor/vulcan:core';
import SimpleSchema from 'simpl-schema';

const contactGroup = {
  name: 'contacts',
  label: 'Contacts',
  order: 10
}

const projectGroup = {
  name: 'projects',
  label: 'Projects',
  order: 20
}

const linkGroup = {
  name: 'links',
  label: 'Links',
  order: 30
}

export const linkSchema = new SimpleSchema({
  platformName: {
    type: String,
    optional: true,
    viewableBy: ["members"],
    insertableBy: ["admins"],
    editableBy: ["admins"],
  },
  profileName: {
    type: String,
    optional: true,
    viewableBy: ["members"],
    insertableBy: ["admins"],
    editableBy: ["admins"],
  },
  profileLink: {
    type: String,
    optional: true,
    viewableBy: ["members"],
    insertableBy: ["admins"],
    editableBy: ["admins"],
  },
});

export const projectIdsSchema = new SimpleSchema({
  projectId: {
    type: String,
    optional: true,
    viewableBy: ["members"],
    insertableBy: ["admins"],
    editableBy: ["admins"],
  },
  projectTitle: {
    type: String,
    optional: true,
    viewableBy: ["members"],
    insertableBy: ["admins"],
    editableBy: ["admins"],
  },
});

// export const contactsIdsSchema = new SimpleSchema({
//   contactId: {
//     type: String,
//     optional: true,
//     viewableBy: ["members"],
//     insertableBy: ["admins"],
//     editableBy: ["admins"],
//   },
//   contactName: {
//     type: String,
//     optional: true,
//     viewableBy: ["members"],
//     insertableBy: ["admins"],
//     editableBy: ["admins"],
//   },
//   contactTitle: {
//     type: String,
//     optional: true,
//     viewableBy: ["members"],
//     insertableBy: ["admins"],
//     editableBy: ["admins"],
//   },
// });

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

  displayName: {
    label: "Display Name",
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
  links: {
    label: "Links",
    type: Array,
    optional: true,
    viewableBy: ["members"],
    insertableBy: ["admins"],
    editableBy: ["admins"],
    group: linkGroup
  },
  'links.$': {
    type: linkSchema,
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

  // An office has many projects

  projectIds: {
    label: "Projects",
    type: Array,
    optional: true,
    viewableBy: ["members"],
    insertableBy: ["admins"],
    editableBy: ["admins"],
    group: projectGroup
  },
  'projectIds.$': {
    type: projectIdsSchema,
  },

  // An office has many contacts

  contactIds: {
    type: Array,
    optional: true,
    viewableBy: ["members"],
    resolveAs: {
      fieldName: 'contacts',
      type: '[Contact]',
      resolver: (office, args, { Contacts }) => {
        return Contacts.loader.loadMany(office.contactIds);
      },
      addOriginalField: true
    },
    group: contactGroup
  },
  'contactIds.$': {
    type: String
  },

};

export default schema;
