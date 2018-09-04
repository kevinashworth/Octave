import { createCollection, getDefaultResolvers, getDefaultMutations } from "meteor/vulcan:core";
import schema from "./schema.js";
import './fragments.js';
import './permissions.js';
import './callbacks.js';

const Contacts = createCollection({
  collectionName: "Contacts",

  typeName: "Contact",

  schema,

  resolvers: getDefaultResolvers('Contacts'),

  mutations: getDefaultMutations('Contacts'),

});


// default sort by updatedAt timestamp in descending order
Contacts.addDefaultView(terms => {
  return {
    options: {sort: {updatedAt: -1}}
  };
});

export default Contacts;
