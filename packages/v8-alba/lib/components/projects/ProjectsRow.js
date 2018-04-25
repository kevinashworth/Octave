import { Components, registerComponent, withDocument, withCurrentUser } from 'meteor/vulcan:core';
import React from 'react';
import { Badge } from 'reactstrap';
import { Link } from 'react-router';
import moment from 'moment';
import { DATE_FORMAT_SHORT } from '../../modules/constants.js';
import Projects from '../../modules/projects/collection.js';

const ProjectsRow = ({loading, document, currentUser}) => {
    const project = document;
    const displayDate = project.updatedAt ?
      "Last modified " + moment(project.updatedAt).format(DATE_FORMAT_SHORT) :
      "Created " + moment(project.createdAt).format(DATE_FORMAT_SHORT);

    var badgeColor = "danger";
    switch (project.status) {
      case "On Hiatus":
        badgeColor = "primary";
        break;
      case "Casting":
        badgeColor = "success";
        break;
      case "Ordered":
        badgeColor = "secondary";
        break;
      case "On Hold":
        badgeColor = "info";
        break;
      case "Shooting":
        badgeColor = "light";
        break;
      case "See Notes...":
        badgeColor = "dark";
        break;
      case "Pre-Prod.":
        badgeColor = "warning";
        break;
    }

    // TODO: a map or reduce version of this
    let fake_company = "";
    if (!project.castingCompany) {
      for (var i = 0; i < project.personnel.length; i++) {
        if (project.personnel[i].personnelTitle === "Casting Director")
          fake_company += (project.personnel[i].name.split(' ').slice(-1).join(' ') + "/");
      }

      if (fake_company.length > 0) {
        fake_company = fake_company.slice(0, -1);
        fake_company += " Casting";
      } else {
        fake_company = "Unknown Casting Office";
      }
    }

    if (loading) {
      return (
        <tr></tr>
      )
    } else {
    return (
      <tr>
        <td><Link to={`/projects/${project._id}/${project.slug}`}>{project.projectTitle}</Link></td>
        <td>{project.projectType}</td>
        <td>{displayDate}</td>
        <td>{project.castingCompany ? project.castingCompany : fake_company}</td>
        <td>
          <Badge color={badgeColor}>{project.status}</Badge>
        </td>
      </tr>
    )}
}

const options = {
  collection: Projects,
  queryName: 'projectsSingleQuery',
  fragmentName: 'ProjectsDetailsFragment',
};

registerComponent('ProjectsRow', ProjectsRow, withCurrentUser, [withDocument, options]);
