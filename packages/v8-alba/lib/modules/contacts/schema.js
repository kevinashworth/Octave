import FormsUpload from "meteor/vulcan:forms-upload";
import { getSetting } from "meteor/vulcan:core";

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
    label: "Body",
    type: String,
    optional: true,
    control: "textarea", // use a textarea form component
    viewableBy: ["guests"],
    insertableBy: ["members"],
    editableBy: ["members"]
  }
};

export default schema;
