import { Utils } from 'meteor/vulcan:core';
import SimpleSchema from 'simpl-schema';
import marked from 'marked';
import { addressSchema } from '../shared_schemas.js';

function getFullNameFromContact ({firstName, middleName, lastName}) {
  let tempName = "";
  if (firstName) {
    tempName += firstName;
  }
  if (middleName) {
    tempName += (" " + middleName);
  }
  if (lastName) {
    tempName += (" " + lastName);
  }
  if (tempName.length) {
    return tempName;
  } else {
    return "displayName or fullName Unknown";
  }
}

const addressGroup = {
  name: 'addresses',
  label: 'Addresses',
  order: 5
}

const projectGroup = {
  name: 'projects',
  label: 'Projects',
  order: 10
}

const linkGroup = {
  name: 'links',
  label: 'Links',
  order: 20
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

export const projectSchema = new SimpleSchema({
  projectId: {
    type: String,
    control: "SelectProjectIdNameTitle",
    optional: true,
    viewableBy: ["members"],
    insertableBy: ["admins"],
    editableBy: ["admins"],
    options: props => props.data.projects.results.map(project => ({
        value: project._id,
        label: project.projectTitle,
      })),
  },
  projectTitle: {
    type: String,
    optional: true,
    hidden: true,
    viewableBy: ["members"],
    insertableBy: ["admins"],
    editableBy: ["admins"],
  },
  titleForProject: {
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
  displayName: {
    type: String,
    optional: true,
    viewableBy: ["guests"],
    insertableBy: ["admins"],
    editableBy: ["admins"],
    onInsert: (contact) => getFullNameFromContact(contact),
    onEdit: (modifier, contact) => {
      if (modifier.$set.displayName) {
        return modifier.$set.displayName;
      }
      return getFullNameFromContact({
        firstName: modifier.$set.firstName ? modifier.$set.firstName : null,
        middleName: modifier.$set.middleName ? modifier.$set.middleName : null,
        lastName: modifier.$set.lastName ? modifier.$set.lastName : null,
      });
    }
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
  // Body (Markdown)
  body: {
    label: "Notes",
    type: String,
    optional: true,
    control: "textarea", // use a textarea form component
    viewableBy: ["members"],
    insertableBy: ["admins"],
    editableBy: ["admins"]
  },
  // HTML version of Body
  htmlBody: {
    type: String,
    optional: true,
    hidden: true,
    viewableBy: ["members"],
    insertableBy: ["admins"],
    editableBy: ["admins"],
    onInsert: (project) => {
      if (project.body) {
        return Utils.sanitize(marked(project.body));
      }
    },
    onEdit: (modifier, project) => {
      if (modifier.$set.body) {
        return Utils.sanitize(marked(modifier.$set.body));
      }
    }
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
  addresses: {
    type: Array,
    optional: true,
    viewableBy: ["members"],
    insertableBy: ["admins"],
    editableBy: ["admins"],
    group: addressGroup
  },
  'addresses.$': {
    type: addressSchema
  },
  slug: {
    type: String,
    optional: true,
    viewableBy: ["members"],
    insertableBy: ["admins"],
    editableBy: ["admins"],
    onInsert: (contact) => {
      return Utils.slugify(getFullNameFromContact(contact));
    },
    onEdit: (modifier, contact) => {
      return Utils.slugify(getFullNameFromContact({
        firstName: modifier.$set.firstName ? modifier.$set.firstName : null,
        middleName: modifier.$set.middleName ? modifier.$set.middleName : null,
        lastName: modifier.$set.lastName ? modifier.$set.lastName : null,
      }));
    }
    // onEdit: (modifier, contact) => {
    //   if (modifier.$set.firstName || modifier.$set.middleName || modifier.$set.lastName) {
    //     return Utils.slugify(contact.displayName);
    //   }
    // }
  },
  updatedAt: {
    type: Date,
    optional: true,
    viewableBy: ["guests"],
    onInsert: () => {
      return new Date();
    },
    onEdit: () => {
      return new Date();
    }
  },

  // A contact has many projects

  projects: {
    label: "Projects",
    type: Array,
    optional: true,
    viewableBy: ["members"],
    insertableBy: ["admins"],
    editableBy: ["admins"],
    query: `
      projects{
        results{
          _id
          projectTitle
        }
      }
    `,
    group: projectGroup
  },
  'projects.$': {
    type: projectSchema,
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
      resolver: (contact) => getFullNameFromContact(contact)
    },
  },

  // GraphQL only fields to ease transition from address to addresses, and also to provide a "main" address

  street: {
    label: "Address",
    type: String,
    optional: true,
    viewableBy: ["members"],
    resolveAs: {
      type: "String",
      resolver: (contact) => {
        if (contact.addresses) {
          if (contact.addresses[0].street2) {
            return contact.addresses[0].street1 + " " + contact.addresses[0].street2;
          }
          return contact.addresses[0].street1;
        }
        return null;
      }
    }
  },
  street1: {
    label: "Address",
    type: String,
    optional: true,
    viewableBy: ["members"],
    resolveAs: {
      type: "String",
      resolver: (contact) => {
        if (contact.addresses) {
          return contact.addresses[0].street1
        }
        return null;
      }
    }
  },
  street2: {
    label: "(cont)",
    type: String,
    optional: true,
    viewableBy: ["members"],
    resolveAs: {
      type: "String",
      resolver: (contact) => {
        if (contact.addresses) {
          return contact.addresses[0].street2
        }
        return null;
      }
    }
  },
  city: {
    label: "City",
    type: String,
    optional: true,
    viewableBy: ["members"],
    resolveAs: {
      type: "String",
      resolver: (contact) => {
        if (contact.addresses) {
          return contact.addresses[0].city
        }
        return null;
      }
    }
  },
  state: {
    label: "State",
    type: String,
    optional: true,
    viewableBy: ["members"],
    resolveAs: {
      type: "String",
      resolver: (contact) => {
        if (contact.addresses) {
          return contact.addresses[0].state
        }
        return null;
      }
    }
  },
  location: {
    label: "Location",
    type: String,
    optional: true,
    viewableBy: ["members"],
    resolveAs: {
      type: "String",
      resolver: (contact) => {
        if (contact.addresses) {
          const state = contact.addresses[0].state;
          if (state === "CA" || state.indexOf("Calif") > -1) {
            return "CA";
          }
          if (state === "NY" || state === "N.Y." || state === "New York") {
            return "NY";
          }
        }
        return "Other";
      }
    }
  },
  zip: {
    label: "Zip",
    type: String,
    optional: true,
    viewableBy: ["members"],
    resolveAs: {
      type: "String",
      resolver: (contact) => {
        if (contact.addresses) {
          return contact.addresses[0].zip
        }
        return null;
      }
    }
  },

};

export default schema;
