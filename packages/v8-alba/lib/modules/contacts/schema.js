import { Utils } from 'meteor/vulcan:core';
import SimpleSchema from 'simpl-schema';

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
  firstName: {
    label: "First",
    type: String,
    optional: true,
    viewableBy: ["guests"],
    insertableBy: ["admins"],
    editableBy: ["admins"]
  },
  middleName: {
    label: "Middle",
    type: String,
    optional: true,
    viewableBy: ["guests"],
    insertableBy: ["admins"],
    editableBy: ["admins"]
  },
  lastName: {
    label: "Last",
    type: String,
    optional: true,
    viewableBy: ["guests"],
    insertableBy: ["admins"],
    editableBy: ["admins"]
  },
  title: {
    label: "Title",
    type: String,
    optional: true,
    viewableBy: ["guests"],
    insertableBy: ["admins"],
    editableBy: ["admins"]
  },
  gender: {
    label: "Gender",
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

  // A contact has many projects

  projectIds: {
    label: "Projects",
    type: Array,
    optional: true,
    viewableBy: ["members"],
    insertableBy: ["admins"],
    editableBy: ["admins"],
  },
  'projectIds.$': {
    type: projectIdsSchema,
  },

  // projectsCount: {
  //   type: Number,
  //   optional: true,
  //   viewableBy: ['guests'],
  //   resolveAs: {
  //     type: 'Int',
  //     resolver: (contact, args, { Projects }) => {
  //       const projectsCount = Projects.find({ contactId: contact._id }).count();
  //       return projectsCount;
  //     },
  //   }
  // },
  // projects: {
  //   type: Object,
  //   optional: true,
  //   viewableBy: ['members'],
  //   resolveAs: {
  //     arguments: 'limit: Int = 5',
  //     type: '[Project]',
  //     resolver: (contact, { limit }, { currentUser, Users, Projects }) => {
  //       const projects = Projects.find({_id: {$in: contactIds}}, { limit }).fetch();
  //
  //       // restrict documents fields
  //       const viewableProjects = _.filter(projects, projects => Projects.checkAccess(currentUser, projects));
  //       const restrictedProjects = Users.restrictViewableFields(currentUser, Projects, viewableProjects);
  //
  //       return restrictedProjects;
  //     }
  //   }
  // },


  // GraphQL only fields

  fullName: {
    label: "Full Name",
    type: String,
    optional: true,
    viewableBy: ["members"],
    resolveAs: {
      type: "String",
      resolver: (contact, args, context) => {
        if (!contact.displayName) {
          let tempName = "";
          if (contact.firstName) {
            tempName += contact.firstName;
          }
          if (contact.middleName) {
            tempName += (" " + contact.middleName);
          }
          if (contact.lastName) {
            tempName += (" " + contact.lastName);
          }
          if (tempName.length) {
            return tempName;
          } else {
            return "Name Unknown";
          }
        } else {
          return contact.displayName;
        }
      },
    }
  },

};

export default schema;
