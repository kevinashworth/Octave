import SimpleSchema from 'simpl-schema';

export const dataSchema = new SimpleSchema({
  date: {
    type: Date,
    optional: true,
    viewableBy: ["members"],
    insertableBy: ["members"],
    editableBy: ["members"],
  },
  quantity: {
    type: Number,
    optional: true,
    viewableBy: ["members"],
    insertableBy: ["members"],
    editableBy: ["members"],
  },
});

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

  updatedAt: {
    type: Date,
    optional: true,
    viewableBy: ["members"],
    onInsert: () => {
      return new Date();
    },
    onEdit: () => {
      return new Date();
    }
  },
  episodics: {
    label: "Episodics",
    type: Array,
    optional: true,
    viewableBy: ["members"],
    insertableBy: ["members"],
    editableBy: ["members"],
  },
  'episodics.$': {
    type: dataSchema,
  },
  pilots: {
    label: "Pilots",
    type: Array,
    optional: true,
    viewableBy: ["members"],
    insertableBy: ["members"],
    editableBy: ["members"],
  },
  'pilots.$': {
    type: dataSchema,
  },
  features: {
    label: "Features",
    type: Array,
    optional: true,
    viewableBy: ["members"],
    insertableBy: ["members"],
    editableBy: ["members"],
  },
  'features.$': {
    type: dataSchema,
  },
  others: {
    label: "Others",
    type: Array,
    optional: true,
    viewableBy: ["members"],
    insertableBy: ["members"],
    editableBy: ["members"],
  },
  'others.$': {
    type: dataSchema,
  },
};

export default schema;
