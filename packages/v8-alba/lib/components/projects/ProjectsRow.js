import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from 'reactstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';

const DATE_FORMAT_SHORT = 'YYYY-MM-DD';
// const DATE_FORMAT_LONG = 'MMMM DD YYYY, h:mm:ss a';

class ProjectsRow extends React.Component {
  render() {
    const project = this.props.project;
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
    if (!project.casting_company) {
      for (var i = 0; i < project.personnel.length; i++) {
        if (project.personnel[i].personnel_title === "Casting Director")
          fake_company += (project.personnel[i].name.split(' ').slice(-1).join(' ') + "/");
      }

      if (fake_company.length > 0) {
        fake_company = fake_company.slice(0, -1);
        fake_company += " Casting";
      } else {
        fake_company = "Unknown Casting Office";
      }
    }

    return (
      <tr>
        <td><Link to={`/projects/${project.project_id}`}>{project.project_title}</Link></td>
        <td>{project.project_type}</td>
        <td>{moment(String(project.last_modified)).format(DATE_FORMAT_SHORT)}</td>
        <td>{project.casting_company ? project.casting_company : fake_company}</td>
        <td>
          <Badge color={badgeColor}>{project.status}</Badge>
        </td>
      </tr>

    )
  }
}

ProjectsRow.propTypes = {
  project: PropTypes.object
}

export default ProjectsRow;
