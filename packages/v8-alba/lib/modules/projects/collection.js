import { createCollection, getDefaultResolvers, getDefaultMutations } from "meteor/vulcan:core";
import schema from "./schema.js";
import './fragments.js';
import './permissions.js';
import './callbacks.js';

const Projects = createCollection({
  collectionName: "Projects",

  typeName: "Project",

  schema,

  resolvers: getDefaultResolvers('Projects'),

  mutations: getDefaultMutations('Projects'),

});


// default sort by createdAt timestamp in descending order
Projects.addDefaultView(terms => {
  return {
    options: {sort: {createdAt: -1}}
  };
});

export default Projects;
