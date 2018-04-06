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
    viewableBy: ["guests"],
    onInsert: () => {
      return new Date();
    }
  },
  userId: {
    type: String,
    optional: true,
    viewableBy: ["guests"]
  },

  // custom properties

  displayName: {
    label: "Name",
    type: String,
    optional: true,
    viewableBy: ["guests"]
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
    viewableBy: ["guests"],
    insertableBy: ["admins"],
    editableBy: ["admins"]
  },
  state: {
    label: "State",
    type: String,
    optional: true,
    viewableBy: ["guests"],
    insertableBy: ["admins"],
    editableBy: ["admins"]
  },
  zip: {
    label: "Zip",
    type: Number,
    optional: true,
    viewableBy: ["members"],
    insertableBy: ["admins"],
    editableBy: ["admins"]
  }
};

export default schema;
