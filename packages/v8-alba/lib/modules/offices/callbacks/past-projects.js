import { Connectors } from 'meteor/vulcan:core'
import PastProjects from '../../past-projects/collection.js'

/*
When updating a [past] project on an office, also update that project with the office.
I get confused, so here's a description:

Where i represents the project(s) we're adding to our office,
office.projects[i] has { projectId }

But we actually get all projects, not just i, the new ones.

So for each of the office.projects we update project.castingOfficeId of the Project with _id === projectId with
{
  castingOfficeId: office._id
}
*/

export function OfficeEditUpdatePastProjects (document, properties) {
  const office = document
  if (!office.pastProjects) {
    return
  }

  office.pastProjects.forEach(officeProject => {
    const project = PastProjects.findOne(officeProject.projectId) // TODO: error handling
    const newOfficeId = office._id
    if (project.castingOfficeId !== newOfficeId) {
      Connectors.update(PastProjects, project._id, { $set: {
        castingOfficeId: newOfficeId
        // updatedAt: new Date() 2019-11-22: let's not update the date of ancient projects
      } })
    }
  })
}
