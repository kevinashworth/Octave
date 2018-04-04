import { createCollection } from "meteor/vulcan:core";
import schema from "./schema.js";

const Contacts = createCollection({
  collectionName: "Contacts",

  typeName: "Contact",

  schema
});

export default Contacts;
