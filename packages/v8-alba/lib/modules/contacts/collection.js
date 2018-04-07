import { createCollection, getDefaultResolvers, getDefaultMutations } from "meteor/vulcan:core";
import schema from "./schema.js";
import './fragments.js';
import './permissions.js';

const Contacts = createCollection({
  collectionName: "contacts",

  typeName: "Contact",

  schema,

  resolvers: getDefaultResolvers('contacts'),

  mutations: getDefaultMutations('contacts'),

});


// default sort by createdAt timestamp in descending order
Contacts.addDefaultView(terms => {
  return {
    options: {sort: {createdAt: -1}}
  };
});

export default Contacts;
