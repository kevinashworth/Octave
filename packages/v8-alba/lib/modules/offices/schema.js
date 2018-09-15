import { Utils } from 'meteor/vulcan:core';
import SimpleSchema from 'simpl-schema';

function getContactsAsOptions (contacts) {
  return contacts.map(contact => ({
    value: contact._id,
    label: contact.fullName,
  }));
}

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

const linkSchema = new SimpleSchema({
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

const projectIdsSchema = new SimpleSchema({
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

// const contactsIdsSchema = new SimpleSchema({
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
    control: "MySelectMultiple",
    viewableBy: ["members"],
    insertableBy: ["admins"],
    editableBy: ["admins"],
    options: props => {
      return getContactsAsOptions(props.data.ContactsList);
    },
    query: `
      ContactsList{
        _id
        fullName
      }
    `,
    resolveAs: {
      fieldName: 'contacts',
      type: '[Contact]',
      resolver: async (office, args, {currentUser, Users, Contacts}) => {
        if (!office.contactIds) return [];
        const contacts = _.compact(await Contacts.loader.loadMany(office.contactIds));
        return Users.restrictViewableFields(currentUser, Contacts, contacts);
      },
      addOriginalField: true,
    },
    group: contactGroup
  },
  'contactIds.$': {
    type: Object,
    optional: true
  },
  'contactIds.$.value': {
    type: String,
    optional: true,
    label: 'contactId',
    description: 'contactId'
  },
  'contactIds.$.label': {
    type: String,
    optional: true,
    label: 'contactName',
    description: 'contactName'
  },
  'contactIds.$.title': {
    type: String,
    optional: true
  }

};

export default schema;
