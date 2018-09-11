import { createCollection, getDefaultResolvers, getDefaultMutations } from "meteor/vulcan:core";
import schema from './schema.js';

const Projects = createCollection({
  collectionName: "Projects",

  typeName: "Project",

  schema,

  resolvers: getDefaultResolvers('Projects'),

  mutations: getDefaultMutations('Projects'),

});

export default Projects;
