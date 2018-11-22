import { Connectors, addCallback } from 'meteor/vulcan:core'
import Projects from '../projects/collection.js'

/*
When updating a project on an office, also update that project with the office.
I get confused, so here's a description:

Where i represents the project(s) we're adding to our office,
office.projects[i] has { projectId }

But we actually get all projects, not just i, the new ones.

So for each of the office.projects we update project.castingOffice of the Project with _id === projectId with
{
  officeId: office._id
}

TODO: For some reason, the project's `updatedAt` field doesn't get a `new Date()` `onEdit`
*/
function OfficeEditUpdateProjects (office) {
  if (!office.projects) {
    return
  }

  office.projects.forEach(officeProject => {
    const project = Projects.findOne(officeProject.projectId) // TODO: error handling
    const newOffice = office._id
    Connectors.update(Projects, project._id, { $set: { castingOffice: newOffice } })
  })
}

addCallback('office.create.after', OfficeEditUpdateProjects)
addCallback('office.update.after', OfficeEditUpdateProjects)
