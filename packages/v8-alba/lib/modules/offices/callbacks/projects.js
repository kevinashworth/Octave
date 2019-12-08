import { Connectors } from 'meteor/vulcan:core'
import Projects from '../../projects/collection.js'

/*
When updating a project on an office, also update that project with the office.
I get confused, so here's a description:

Where i represents the project(s) we're adding to our office,
office.projects[i] has { projectId }

But we actually get all projects, not just i, the new ones.

So for each of the office.projects we update project.castingOfficeId of the Project with _id === projectId with
{
  castingOfficeId: office._id
}
*/

export function OfficeEditUpdateProjects (document, properties) {
  const office = document
  if (!office.projects) {
    return
  }

  office.projects.forEach(officeProject => {
    const project = Projects.findOne(officeProject.projectId) // TODO: error handling
    const newOfficeId = office._id
    if (project.castingOfficeId !== newOfficeId) {
      Connectors.update(Projects, project._id, { $set: {
        castingOfficeId: newOfficeId,
        updatedAt: new Date()
      } })
    }
  })
}
