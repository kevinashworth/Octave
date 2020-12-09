# contacts/callbacks

## contacts/callbacks/offices.js
/*
contact {
  _id
  ...
  offices {
    officeId
    officeLocation
    officeName
  }
  ...
}

office {
  _id
  displayName
  ...
  contacts {
    contactId
    contactName
    contactTitle
  }
  ...
}

After updating contact:
1 - contact.offices was changed?
    N: do nothing
    Y:  2 - any offices were removed?
            N: go to 3
            Y: update those offices: find by officeId, remove this contact from office.contacts
        3 - any offices were added?
            N: go to 4
            Y: update those offices: find by officeId, add this contact to office.contacts (see Q&A)
        4 - any other changes, like array order, officeLocation, or officeName?
            Y or N: we only care here about a missing officeName in the `before` callback

After creating contact:
1 - contact.offices has offices?
    N: do nothing
    Y: update those offices a la Yes to 3 above and Q&A below

Q: What about contact.contactTitle for the office?
A: Leave it alone. If it needs to be different than the contact's default title,
   it can only be changed by editing the office, not the contact. So we just add
    {
      contactId: contact._id,
      contactName: getFullNameFromContact(contact)
    }
*/

## contacts/callbacks/past-projects.js and contacts/callbacks/projects.js

contact {
  _id
  ...
  pastProjects {
    projectId
    projectTitle
    titleForProject
  }
  ...
}

past-project {
  _id
  projectTitle
  ...
  contacts {
    contactId
    contactName
    contactTitle
  }
  ...
}

After updating contact:
1 - contact.pastProjects was changed?
    N: do nothing
    Y:  2 - any pastProjects were removed?
            N: go to 3
            Y: update those pastProjects: find by projectId, remove this contact from pastProject.contacts
        3 - any pastProjects were added?
            N: go to 4
            Y: update those pastProjects: find by projectId, add this contact to pastProjects.contacts (see Q&A)
        4 - any other changes, like array order, ___, or ___?
            Y or N: we only care here about a missing projectTitle in the `before` callback

After creating contact:
1 - contact.pastProjects has pastProjects?
    N: do nothing
    Y: update those pastProjects a la Yes to 3 above and Q&A below
*/

