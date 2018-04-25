import { Utils } from 'meteor/vulcan:core';
import SimpleSchema from 'simpl-schema';

// const Address = `
//   type Address {
//     street1: String
//     street2: String
//     city: String
//     state: String
//     zip: String
//   }`;
// addGraphQLSchema(Address);

// export const addressSchema = new SimpleSchema({
//   street1: {
//     type: String,
//     optional: true,
//     viewableBy: ["guests"],
//     insertableBy: ["admins"],
//     editableBy: ["admins"]
//   },
//   street2: {
//     type: String,
//     optional: true,
//     viewableBy: ["guests"],
//     insertableBy: ["admins"],
//     editableBy: ["admins"]
//   },
//   city: {
//     type: String,
//     optional: true,
//     viewableBy: ["guests"],
//     insertableBy: ["admins"],
//     editableBy: ["admins"]
//   },
//   state: {
//     type: String,
//     optional: true,
//     viewableBy: ["guests"],
//     insertableBy: ["admins"],
//     editableBy: ["admins"]
//   },
//   zip: {
//     type: String,
//     optional: true,
//     viewableBy: ["guests"],
//     insertableBy: ["admins"],
//     editableBy: ["admins"]
//   },
// });

export const personnelSchema = new SimpleSchema({
  personnelId: {
    type: String,
    optional: true,
    viewableBy: ["members"],
    insertableBy: ["admins"],
    editableBy: ["admins"],
  },
  name: {
    type: String,
    optional: true,
    viewableBy: ["members"],
    insertableBy: ["admins"],
    editableBy: ["admins"],
  },
  personnelTitle: {
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
  personnel: {
    label: "Personnel",
    type: Array,
    optional: true,
    viewableBy: ["members"],
    insertableBy: ["admins"],
    editableBy: ["admins"],
  },
  'personnel.$': {
    type: personnelSchema,
  },
  address: {
    type: Object,
    optional: true,
    viewableBy: ["guests"],
    insertableBy: ["admins"],
    editableBy: ["admins"],
  },
  slug: {
    type: String,
    optional: true,
    viewableBy: ["members"],
    onInsert: (project) => {
      return Utils.slugify(project.projectTitle);
    },
    onEdit: (modifier, project) => {
      if (modifier.$set.displayName) {
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
